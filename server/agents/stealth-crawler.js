const { parentPort } = require('worker_threads');
const axios = require('axios');
const sharp = require('sharp');
const { createHash } = require('crypto');

class StealthCrawler {
  constructor() {
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ];
  }

  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  async generateImageHash(imageUrl) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': this.getRandomUserAgent(),
        },
        timeout: 10000,
      });

      // Generate perceptual hash using Sharp
      const buffer = Buffer.from(response.data);
      const { data, info } = await sharp(buffer)
        .resize(64, 64)
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Create a simple perceptual hash
      const hash = createHash('md5');
      hash.update(data);
      return hash.digest('hex');

    } catch (error) {
      console.error('Error generating image hash:', error.message);
      return null;
    }
  }

  async searchGoogle(query, searchType = 'image') {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cseId = process.env.GOOGLE_CSE_ID;

    if (!apiKey || !cseId) {
      throw new Error('Google API credentials not configured');
    }

    try {
      const response = await axios.get('https://customsearch.googleapis.com/customsearch/v1', {
        params: {
          key: apiKey,
          cx: cseId,
          q: query,
          searchType: searchType,
          num: 10,
        },
        headers: {
          'User-Agent': this.getRandomUserAgent(),
        },
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Google search error:', error.message);
      return [];
    }
  }

  async searchBing(query, searchType = 'images') {
    const apiKey = process.env.BING_API_KEY;

    if (!apiKey) {
      throw new Error('Bing API credentials not configured');
    }

    const endpoint = searchType === 'images' 
      ? 'https://api.bing.microsoft.com/v7.0/images/search'
      : 'https://api.bing.microsoft.com/v7.0/videos/search';

    try {
      const response = await axios.get(endpoint, {
        params: {
          q: query,
          count: 10,
        },
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'User-Agent': this.getRandomUserAgent(),
        },
      });

      return response.data.value || [];
    } catch (error) {
      console.error('Bing search error:', error.message);
      return [];
    }
  }

  async crawlPlatforms(contentFingerprint, metadata) {
    const results = {
      google_images: [],
      google_videos: [],
      bing_images: [],
      bing_videos: [],
      total_matches: 0,
      timestamp: new Date().toISOString(),
    };

    const query = metadata.title || metadata.description || 'content search';

    try {
      // Search Google Images
      const googleImages = await this.searchGoogle(query, 'image');
      for (const item of googleImages) {
        if (item.image && item.image.thumbnailLink) {
          const hash = await this.generateImageHash(item.image.thumbnailLink);
          if (hash && this.compareHashes(contentFingerprint, hash)) {
            results.google_images.push({
              url: item.link,
              title: item.title,
              thumbnail: item.image.thumbnailLink,
              similarity: this.calculateSimilarity(contentFingerprint, hash),
            });
          }
        }
      }

      // Search Google Videos
      const googleVideos = await this.searchGoogle(query, 'video');
      results.google_videos = googleVideos.map(item => ({
        url: item.link,
        title: item.title,
        snippet: item.snippet,
      }));

      // Search Bing Images
      const bingImages = await this.searchBing(query, 'images');
      for (const item of bingImages) {
        if (item.thumbnailUrl) {
          const hash = await this.generateImageHash(item.thumbnailUrl);
          if (hash && this.compareHashes(contentFingerprint, hash)) {
            results.bing_images.push({
              url: item.contentUrl,
              title: item.name,
              thumbnail: item.thumbnailUrl,
              similarity: this.calculateSimilarity(contentFingerprint, hash),
            });
          }
        }
      }

      // Search Bing Videos
      const bingVideos = await this.searchBing(query, 'videos');
      results.bing_videos = bingVideos.map(item => ({
        url: item.contentUrl,
        title: item.name,
        description: item.description,
        thumbnail: item.thumbnailUrl,
      }));

      results.total_matches = results.google_images.length + 
                             results.google_videos.length + 
                             results.bing_images.length + 
                             results.bing_videos.length;

    } catch (error) {
      console.error('Error crawling platforms:', error);
    }

    return results;
  }

  compareHashes(hash1, hash2) {
    if (!hash1 || !hash2) return false;
    
    // Simple hash comparison - in production, use Hamming distance
    const similarity = this.calculateSimilarity(hash1, hash2);
    return similarity > 0.8; // 80% similarity threshold
  }

  calculateSimilarity(hash1, hash2) {
    if (!hash1 || !hash2 || hash1.length !== hash2.length) return 0;
    
    let matches = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] === hash2[i]) matches++;
    }
    
    return matches / hash1.length;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Worker thread execution
async function runCrawler() {
  const crawler = new StealthCrawler();
  
  try {
    // Mock content for demonstration
    const mockContent = {
      fingerprint: 'mock_fingerprint_hash_123',
      metadata: {
        title: 'Protected Content',
        description: 'Original creative work',
      }
    };

    const results = await crawler.crawlPlatforms(
      mockContent.fingerprint, 
      mockContent.metadata
    );

    if (parentPort) {
      parentPort.postMessage({
        status: 'success',
        agent: 'stealth-crawler',
        results,
        timestamp: new Date().toISOString(),
      });
    }

  } catch (error) {
    if (parentPort) {
      parentPort.postMessage({
        status: 'error',
        agent: 'stealth-crawler',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

// Run if this is a worker thread
if (parentPort) {
  runCrawler();
}

module.exports = StealthCrawler;
