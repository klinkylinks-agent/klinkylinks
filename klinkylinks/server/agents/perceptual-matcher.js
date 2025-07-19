const { parentPort } = require('worker_threads');
const sharp = require('sharp');
const axios = require('axios');
const { createHash } = require('crypto');

class PerceptualMatcher {
  constructor() {
    this.hashSize = 8; // 8x8 hash
    this.threshold = 0.85; // 85% similarity threshold
  }

  async generatePerceptualHash(imageBuffer) {
    try {
      // Resize to hash size and convert to grayscale
      const { data, info } = await sharp(imageBuffer)
        .resize(this.hashSize, this.hashSize, { fit: 'fill' })
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Calculate average pixel value
      const pixelSum = data.reduce((sum, pixel) => sum + pixel, 0);
      const average = pixelSum / data.length;

      // Generate binary hash based on average
      let hashBits = '';
      for (let i = 0; i < data.length; i++) {
        hashBits += data[i] > average ? '1' : '0';
      }

      return hashBits;
    } catch (error) {
      console.error('Error generating perceptual hash:', error);
      return null;
    }
  }

  async downloadImage(url) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  }

  calculateHammingDistance(hash1, hash2) {
    if (!hash1 || !hash2 || hash1.length !== hash2.length) {
      return Infinity;
    }

    let distance = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) {
        distance++;
      }
    }
    return distance;
  }

  calculateSimilarity(hash1, hash2) {
    const distance = this.calculateHammingDistance(hash1, hash2);
    if (distance === Infinity) return 0;
    
    const maxDistance = hash1.length;
    return 1 - (distance / maxDistance);
  }

  async compareImages(originalImageUrl, suspiciousImageUrl) {
    try {
      // Download both images
      const [originalBuffer, suspiciousBuffer] = await Promise.all([
        this.downloadImage(originalImageUrl),
        this.downloadImage(suspiciousImageUrl),
      ]);

      if (!originalBuffer || !suspiciousBuffer) {
        return { similarity: 0, error: 'Failed to download images' };
      }

      // Generate perceptual hashes
      const [originalHash, suspiciousHash] = await Promise.all([
        this.generatePerceptualHash(originalBuffer),
        this.generatePerceptualHash(suspiciousBuffer),
      ]);

      if (!originalHash || !suspiciousHash) {
        return { similarity: 0, error: 'Failed to generate hashes' };
      }

      // Calculate similarity
      const similarity = this.calculateSimilarity(originalHash, suspiciousHash);
      
      return {
        similarity,
        isMatch: similarity >= this.threshold,
        originalHash,
        suspiciousHash,
        hammingDistance: this.calculateHammingDistance(originalHash, suspiciousHash),
      };

    } catch (error) {
      return { similarity: 0, error: error.message };
    }
  }

  async batchCompareImages(originalImageUrl, suspiciousImageUrls) {
    const results = [];
    
    for (let i = 0; i < suspiciousImageUrls.length; i++) {
      const url = suspiciousImageUrls[i];
      console.log(`Comparing image ${i + 1}/${suspiciousImageUrls.length}: ${url}`);
      
      const result = await this.compareImages(originalImageUrl, url);
      results.push({
        url,
        ...result,
      });

      // Add delay to avoid rate limiting
      if (i < suspiciousImageUrls.length - 1) {
        await this.delay(1000);
      }
    }

    return results;
  }

  async processInfringementDetection(originalContent, suspiciousUrls) {
    try {
      const matches = [];
      const nonMatches = [];
      
      for (const url of suspiciousUrls) {
        const comparison = await this.compareImages(originalContent.s3Url, url);
        
        if (comparison.isMatch) {
          matches.push({
            url,
            similarity: comparison.similarity,
            confidence: this.calculateConfidence(comparison.similarity),
          });
        } else {
          nonMatches.push({
            url,
            similarity: comparison.similarity,
          });
        }
      }

      return {
        originalContent: originalContent.filename,
        totalChecked: suspiciousUrls.length,
        matches: matches.length,
        nonMatches: nonMatches.length,
        matchedUrls: matches,
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      throw new Error(`Infringement detection failed: ${error.message}`);
    }
  }

  calculateConfidence(similarity) {
    if (similarity >= 0.95) return 'very_high';
    if (similarity >= 0.90) return 'high';
    if (similarity >= 0.85) return 'medium';
    if (similarity >= 0.75) return 'low';
    return 'very_low';
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Worker thread execution
async function runPerceptualMatcher() {
  const matcher = new PerceptualMatcher();
  
  try {
    // Mock data for demonstration
    const mockOriginalUrl = 'https://via.placeholder.com/500x500/0066FF/FFFFFF?text=Original';
    const mockSuspiciousUrls = [
      'https://via.placeholder.com/500x500/FF0080/FFFFFF?text=Suspicious1',
      'https://via.placeholder.com/600x400/00FFFF/000000?text=Suspicious2',
    ];

    const results = await matcher.batchCompareImages(mockOriginalUrl, mockSuspiciousUrls);

    if (parentPort) {
      parentPort.postMessage({
        status: 'success',
        agent: 'perceptual-matcher',
        results,
        summary: {
          totalCompared: results.length,
          matches: results.filter(r => r.isMatch).length,
          averageSimilarity: results.reduce((sum, r) => sum + r.similarity, 0) / results.length,
        },
        timestamp: new Date().toISOString(),
      });
    }

  } catch (error) {
    if (parentPort) {
      parentPort.postMessage({
        status: 'error',
        agent: 'perceptual-matcher',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

// Run if this is a worker thread
if (parentPort) {
  runPerceptualMatcher();
}

module.exports = PerceptualMatcher;
