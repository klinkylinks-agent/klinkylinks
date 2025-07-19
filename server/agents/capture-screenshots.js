const { parentPort } = require('worker_threads');
const puppeteer = require('puppeteer');
const aws = require('aws-sdk');
const sharp = require('sharp');

class ScreenshotCapture {
  constructor() {
    this.s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
    });
    
    this.bucketName = process.env.S3_BUCKET;
    this.browser = null;
  }

  async initializeBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      });
    }
    return this.browser;
  }

  async captureScreenshot(url, options = {}) {
    let page = null;
    
    try {
      const browser = await this.initializeBrowser();
      page = await browser.newPage();

      // Set viewport and user agent
      await page.setViewport({
        width: options.width || 1280,
        height: options.height || 800,
        deviceScaleFactor: 1,
      });

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );

      // Navigate to the page
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Take screenshot
      const screenshotBuffer = await page.screenshot({
        type: 'png',
        fullPage: options.fullPage || false,
      });

      // Create thumbnail (32x32 for compact display)
      const thumbnailBuffer = await sharp(screenshotBuffer)
        .resize(32, 32, { fit: 'cover' })
        .png()
        .toBuffer();

      return {
        fullScreenshot: screenshotBuffer,
        thumbnail: thumbnailBuffer,
        timestamp: new Date().toISOString(),
        url: url,
      };

    } catch (error) {
      console.error('Screenshot capture error:', error);
      throw new Error(`Failed to capture screenshot: ${error.message}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async uploadToS3(buffer, fileName, contentType = 'image/png') {
    try {
      const uploadParams = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
        ACL: 'private', // Keep screenshots private
      };

      const result = await this.s3.upload(uploadParams).promise();
      return result.Location;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error(`Failed to upload to S3: ${error.message}`);
    }
  }

  async captureAndUpload(url, infringementId) {
    try {
      // Capture screenshot and thumbnail
      const { fullScreenshot, thumbnail } = await this.captureScreenshot(url);

      // Generate file names
      const timestamp = Date.now();
      const fullScreenshotKey = `screenshots/${infringementId}/${timestamp}-full.png`;
      const thumbnailKey = `screenshots/${infringementId}/${timestamp}-thumb.png`;

      // Upload both versions to S3
      const [fullUrl, thumbnailUrl] = await Promise.all([
        this.uploadToS3(fullScreenshot, fullScreenshotKey),
        this.uploadToS3(thumbnail, thumbnailKey),
      ]);

      return {
        infringementId,
        fullScreenshotUrl: fullUrl,
        thumbnailUrl: thumbnailUrl,
        fullScreenshotKey: fullScreenshotKey,
        thumbnailKey: thumbnailKey,
        capturedAt: new Date().toISOString(),
        success: true,
      };

    } catch (error) {
      return {
        infringementId,
        error: error.message,
        capturedAt: new Date().toISOString(),
        success: false,
      };
    }
  }

  async batchCapture(infringements) {
    const results = [];
    
    for (let i = 0; i < infringements.length; i++) {
      const infringement = infringements[i];
      
      console.log(`Capturing screenshot ${i + 1}/${infringements.length}: ${infringement.url}`);
      
      try {
        const result = await this.captureAndUpload(infringement.url, infringement.id);
        results.push(result);
        
        // Add delay to avoid overwhelming servers
        if (i < infringements.length - 1) {
          await this.delay(3000); // 3 second delay between captures
        }
        
      } catch (error) {
        results.push({
          infringementId: infringement.id,
          error: error.message,
          success: false,
        });
      }
    }
    
    return results;
  }

  async captureWithRetry(url, infringementId, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.captureAndUpload(url, infringementId);
      } catch (error) {
        lastError = error;
        console.log(`Screenshot attempt ${attempt} failed for ${url}, retrying...`);
        
        if (attempt < maxRetries) {
          await this.delay(attempt * 2000); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  }

  async generateVideoThumbnail(videoUrl, infringementId) {
    let page = null;
    
    try {
      const browser = await this.initializeBrowser();
      page = await browser.newPage();

      await page.setViewport({ width: 1280, height: 720 });
      await page.goto(videoUrl, { waitUntil: 'networkidle0' });

      // Try to find and click play button, then pause for thumbnail
      try {
        await page.waitForSelector('video', { timeout: 5000 });
        await page.evaluate(() => {
          const video = document.querySelector('video');
          if (video) {
            video.currentTime = 1; // Seek to 1 second for better thumbnail
            video.pause();
          }
        });
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log('Could not interact with video element');
      }

      // Take screenshot
      const screenshotBuffer = await page.screenshot({ type: 'png' });
      
      // Create thumbnail
      const thumbnailBuffer = await sharp(screenshotBuffer)
        .resize(32, 32, { fit: 'cover' })
        .png()
        .toBuffer();

      const timestamp = Date.now();
      const thumbnailKey = `video-thumbnails/${infringementId}/${timestamp}-thumb.png`;
      const thumbnailUrl = await this.uploadToS3(thumbnailBuffer, thumbnailKey);

      return {
        infringementId,
        thumbnailUrl,
        thumbnailKey,
        type: 'video',
        success: true,
      };

    } catch (error) {
      return {
        infringementId,
        error: error.message,
        type: 'video',
        success: false,
      };
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Worker thread execution
async function runScreenshotCapture() {
  const capturer = new ScreenshotCapture();
  
  try {
    // Mock infringements for demonstration
    const mockInfringements = [
      {
        id: 1,
        url: 'https://example-violation.com/stolen-content',
        type: 'image',
      },
      {
        id: 2,
        url: 'https://video-platform.com/unauthorized-video',
        type: 'video',
      },
    ];

    const results = await capturer.batchCapture(mockInfringements);

    if (parentPort) {
      parentPort.postMessage({
        status: 'success',
        agent: 'screenshot-capture',
        results: {
          totalProcessed: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          screenshots: results,
        },
        timestamp: new Date().toISOString(),
      });
    }

  } catch (error) {
    if (parentPort) {
      parentPort.postMessage({
        status: 'error',
        agent: 'screenshot-capture',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  } finally {
    await capturer.cleanup();
  }
}

// Run if this is a worker thread
if (parentPort) {
  runScreenshotCapture();
}

module.exports = ScreenshotCapture;
