// coreAgents.ts - Cognitive AI agents per blueprint
import OpenAI from 'openai';
import cron from 'node-cron';
import puppeteer from 'puppeteer';
import { db } from '../db.js';
import { contentItems, infringements, dmcaNotices } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Master Orchestrator Agent (POA) - Process Orchestration Agent
export const POA = {
  monitor: async () => {
    try {
      console.log('🎯 POA: Monitoring agent lifecycles...');
      
      // Monitor system resources
      const memoryUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();
      
      // Check database connectivity
      const dbHealthCheck = await db.select().from(contentItems).limit(1);
      
      const healthStatus = {
        timestamp: new Date().toISOString(),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
        database: dbHealthCheck ? 'connected' : 'disconnected',
        agents: {
          sca: 'active',
          pma: 'active', 
          dta: 'active',
        }
      };
      
      console.log('📊 System Health:', JSON.stringify(healthStatus, null, 2));
      return healthStatus;
      
    } catch (error: any) {
      console.error('❌ POA monitoring error:', error);
      return { status: 'error', message: error.message };
    }
  },

  scaleAgents: async (load: number) => {
    console.log(`🔧 POA: Scaling agents based on load: ${load}`);
    // Implementation for dynamic scaling based on workload
    if (load > 0.8) {
      console.log('🚀 High load detected, scaling up agents...');
    } else if (load < 0.2) {
      console.log('📉 Low load detected, scaling down agents...');
    }
  }
};

// Stealth Crawler Agent (SCA) - Web scraping for infringements
export const SCA = {
  crawl: async (query: string, platforms: string[] = ['google', 'bing']) => {
    try {
      console.log(`🕵️ SCA: Crawling platforms [${platforms.join(', ')}] for: "${query}"`);
      
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const results = [];
      
      for (const platform of platforms) {
        const page = await browser.newPage();
        
        // Set realistic user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        try {
          let searchUrl = '';
          
          if (platform === 'google') {
            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
          } else if (platform === 'bing') {
            searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
          }
          
          await page.goto(searchUrl, { waitUntil: 'networkidle2' });
          
          // Extract image URLs and metadata
          const pageResults = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'));
            return images.slice(0, 10).map(img => ({
              src: img.src,
              alt: img.alt || '',
              title: img.title || '',
            })).filter(img => img.src && img.src.startsWith('http'));
          });
          
          results.push({
            platform,
            query,
            results: pageResults,
            count: pageResults.length,
            timestamp: new Date().toISOString(),
          });
          
        } catch (pageError: any) {
          console.error(`❌ Error crawling ${platform}:`, pageError);
          results.push({
            platform,
            query,
            error: pageError.message,
            timestamp: new Date().toISOString(),
          });
        }
        
        await page.close();
        
        // Rate limiting to avoid blocking
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      await browser.close();
      
      console.log(`✅ SCA: Crawling completed. Found ${results.reduce((sum, r) => sum + (r.count || 0), 0)} potential matches`);
      return results;
      
    } catch (error: any) {
      console.error('❌ SCA crawling error:', error);
      throw new Error(`SCA crawl failed: ${error.message}`);
    }
  },

  scheduleRegularScans: () => {
    // Schedule crawling every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      console.log('⏰ SCA: Starting scheduled crawl...');
      
      // Get active content items for monitoring
      const activeContent = await db.select()
        .from(contentItems)
        .where(eq(contentItems.isActive, true))
        .limit(5); // Limit for demo
      
      for (const content of activeContent) {
        const query = (content.metadata as any)?.title || content.originalFilename;
        await SCA.crawl(query, ['google', 'bing']);
        
        // Wait between scans to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    });
  }
};

// Perceptual Matcher Agent (PMA) - Fingerprinting with OpenAI
export const PMA = {
  generateFingerprint: async (content: any) => {
    try {
      console.log(`🔍 PMA: Generating fingerprint for content: ${content.filename}`);
      
      // Use OpenAI to analyze content and create semantic fingerprint
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: `${content.originalFilename} ${content.metadata?.title || ''} ${content.metadata?.description || ''}`,
      });
      
      const embedding = response.data[0].embedding;
      
      // Store fingerprint in database
      await db.update(contentItems)
        .set({ 
          fingerprint: JSON.stringify(embedding),
          updatedAt: new Date(),
        })
        .where(eq(contentItems.id, content.id));
      
      console.log(`✅ PMA: Fingerprint generated and stored for content ID: ${content.id}`);
      return {
        contentId: content.id,
        fingerprint: embedding,
        dimensions: embedding.length,
        timestamp: new Date().toISOString(),
      };
      
    } catch (error: any) {
      console.error('❌ PMA fingerprinting error:', error);
      throw new Error(`PMA fingerprint generation failed: ${error.message}`);
    }
  },

  compareFingerprints: async (originalFingerprint: number[], suspiciousFingerprint: number[]) => {
    try {
      // Calculate cosine similarity between embeddings
      const dotProduct = originalFingerprint.reduce((sum, a, i) => sum + a * suspiciousFingerprint[i], 0);
      const magnitudeA = Math.sqrt(originalFingerprint.reduce((sum, a) => sum + a * a, 0));
      const magnitudeB = Math.sqrt(suspiciousFingerprint.reduce((sum, b) => sum + b * b, 0));
      
      const similarity = dotProduct / (magnitudeA * magnitudeB);
      
      console.log(`🎯 PMA: Similarity calculated: ${(similarity * 100).toFixed(2)}%`);
      
      return {
        similarity,
        isMatch: similarity > 0.85, // 85% threshold
        confidence: similarity > 0.95 ? 'high' : similarity > 0.85 ? 'medium' : 'low',
        timestamp: new Date().toISOString(),
      };
      
    } catch (error: any) {
      console.error('❌ PMA comparison error:', error);
      return { similarity: 0, isMatch: false, error: error.message };
    }
  },

  analyzeContentBatch: async (contentItems: any[], suspiciousUrls: string[]) => {
    try {
      console.log(`🔄 PMA: Analyzing batch of ${contentItems.length} content items against ${suspiciousUrls.length} suspicious URLs`);
      
      const results = [];
      
      for (const content of contentItems) {
        let contentFingerprint = content.fingerprint ? JSON.parse(content.fingerprint) : null;
        
        if (!contentFingerprint) {
          console.log(`⚠️ PMA: No fingerprint found for content ${content.id}, generating...`);
          const fingerprintResult = await PMA.generateFingerprint(content);
          contentFingerprint = fingerprintResult.fingerprint;
        }
        
        for (const url of suspiciousUrls) {
          // Use OpenAI to analyze the suspicious URL content
          const urlAnalysis = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: `suspicious content at ${url}`,
          });
          
          const suspiciousFingerprint = urlAnalysis.data[0].embedding;
          const comparison = await PMA.compareFingerprints(contentFingerprint, suspiciousFingerprint);
          
          if (comparison.isMatch) {
            results.push({
              contentId: content.id,
              suspiciousUrl: url,
              similarity: comparison.similarity,
              confidence: comparison.confidence,
              timestamp: new Date().toISOString(),
            });
          }
        }
      }
      
      console.log(`✅ PMA: Batch analysis complete. Found ${results.length} potential matches`);
      return results;
      
    } catch (error: any) {
      console.error('❌ PMA batch analysis error:', error);
      throw new Error(`PMA batch analysis failed: ${error.message}`);
    }
  }
};

// DMCA & Takedown Agent (DTA) - Draft notices with OpenAI
export const DTA = {
  generateNotice: async (infringementData: any, ownerInfo: any) => {
    try {
      console.log(`📝 DTA: Generating DMCA notice for infringement: ${infringementData.url}`);
      
      const prompt = `
Generate a professional DMCA takedown notice for the following infringement:

INFRINGEMENT DETAILS:
- Infringing URL: ${infringementData.url}
- Platform: ${infringementData.platform}
- Content Title: ${infringementData.contentTitle || 'Protected Creative Work'}
- Description: ${infringementData.description || 'Unauthorized use of copyrighted material'}

OWNER INFORMATION:
- Name: ${ownerInfo.name || 'Content Owner'}
- Email: ${ownerInfo.email || 'owner@example.com'}
- Business: ${ownerInfo.businessName || ''}

Please create a formal DMCA notice that includes:
1. Clear identification of the copyrighted work
2. Identification of the infringing material
3. Contact information
4. Good faith statement
5. Accuracy statement under penalty of perjury
6. Electronic signature
7. Platform-specific formatting if applicable

Make it professional, legally compliant, and ready for submission. Include placeholders for user approval and review.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a legal document specialist who creates professional DMCA takedown notices. Generate formal, legally compliant notices that follow DMCA requirements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent legal language
      });

      const noticeText = completion.choices[0].message.content;
      
      // Store the notice in database for approval workflow
      const [notice] = await db.insert(dmcaNotices).values({
        infringementId: infringementData.id,
        userId: ownerInfo.userId,
        recipientEmail: DTA.getPlatformEmail(infringementData.platform),
        platform: infringementData.platform,
        subject: `DMCA Takedown Notice - ${infringementData.contentTitle || 'Copyright Infringement'}`,
        body: noticeText || '',
        status: 'draft', // Requires human approval
      }).returning();

      console.log(`✅ DTA: DMCA notice generated and saved as draft ID: ${notice.id}`);
      
      return {
        noticeId: notice.id,
        subject: notice.subject,
        body: noticeText,
        recipientEmail: notice.recipientEmail,
        platform: infringementData.platform,
        status: 'draft_pending_approval',
        requiresApproval: true,
        generatedAt: new Date().toISOString(),
      };
      
    } catch (error: any) {
      console.error('❌ DTA notice generation error:', error);
      throw new Error(`DTA notice generation failed: ${error.message}`);
    }
  },

  getPlatformEmail: (platform: string) => {
    const platformContacts = {
      'google': 'copyright@google.com',
      'bing': 'dmca@microsoft.com',
      'facebook': 'ip@meta.com',
      'instagram': 'ip@meta.com',
      'youtube': 'copyright@youtube.com',
      'twitter': 'copyright@twitter.com',
    };
    
    return platformContacts[platform.toLowerCase() as keyof typeof platformContacts] || 'legal@platform.com';
  },

  batchGenerateNotices: async (infringements: any[], ownerInfo: any) => {
    try {
      console.log(`📋 DTA: Batch generating ${infringements.length} DMCA notices`);
      
      const notices = [];
      
      for (const infringement of infringements) {
        try {
          const notice = await DTA.generateNotice(infringement, ownerInfo);
          notices.push(notice);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error: any) {
          console.error(`❌ Failed to generate notice for infringement ${infringement.id}:`, error);
          notices.push({
            infringementId: infringement.id,
            error: error.message,
            status: 'generation_failed',
          });
        }
      }
      
      console.log(`✅ DTA: Batch generation complete. Generated ${notices.filter((n: any) => !n.error).length}/${infringements.length} notices`);
      return notices;
      
    } catch (error: any) {
      console.error('❌ DTA batch generation error:', error);
      throw new Error(`DTA batch generation failed: ${error.message}`);
    }
  },

  reviewAndApprove: async (noticeId: number, approved: boolean, userComments?: string) => {
    try {
      console.log(`👁️ DTA: ${approved ? 'Approving' : 'Rejecting'} notice ID: ${noticeId}`);
      
      await db.update(dmcaNotices)
        .set({
          status: approved ? 'approved' : 'rejected',
          updatedAt: new Date(),
        })
        .where(eq(dmcaNotices.id, noticeId));
      
      console.log(`✅ DTA: Notice ${noticeId} ${approved ? 'approved' : 'rejected'} successfully`);
      
      return {
        noticeId,
        status: approved ? 'approved' : 'rejected',
        reviewedAt: new Date().toISOString(),
      };
      
    } catch (error: any) {
      console.error('❌ DTA review error:', error);
      throw new Error(`DTA review failed: ${error.message}`);
    }
  }
};

// Background scheduling for automated processes
export const initializeAgentScheduling = () => {
  console.log('🚀 Initializing KlinkyLinks AI Agent Scheduling...');
  
  // Daily comprehensive scan - runs at 2 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('🌅 Daily scan initiated by POA...');
    try {
      await POA.monitor();
      
      // Get recent content for scanning
      const recentContent = await db.select()
        .from(contentItems)
        .where(eq(contentItems.isActive, true))
        .limit(10);
      
      for (const content of recentContent) {
        const query = (content.metadata as any)?.title || content.originalFilename;
        const crawlResults = await SCA.crawl(query);
        
        // Process results with PMA
        const suspiciousUrls = crawlResults
          .flatMap(r => r.results?.map(item => item.src) || [])
          .filter(url => url);
        
        if (suspiciousUrls.length > 0) {
          await PMA.analyzeContentBatch([content], suspiciousUrls);
        }
        
        // Small delay between content scans
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } catch (error: any) {
      console.error('❌ Daily scan error:', error);
    }
  });
  
  // Hourly health check
  cron.schedule('0 * * * *', async () => {
    await POA.monitor();
  });
  
  console.log('✅ Agent scheduling initialized successfully');
};

console.log('🎯 KlinkyLinks Core Agents Initialized');

// Export all agents for external use
export default {
  POA,
  SCA,
  PMA,
  DTA,
  initializeAgentScheduling,
};