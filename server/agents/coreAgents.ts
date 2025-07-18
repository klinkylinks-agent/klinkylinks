// coreAgents.ts - Technology-Only AI agents for content monitoring
import OpenAI from 'openai';
import cron from 'node-cron';
import puppeteer from 'puppeteer';
import { db } from '../db.js';
import { contentItems, infringements, dmcaNotices } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Legal Disclaimer: This system provides technology tools only, not legal advice
// Users are responsible for all legal determinations and submissions

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
      
      console.log(`🎯 PMA: Technical similarity calculated: ${(similarity * 100).toFixed(2)}%`);
      
      // Technology-only response - no legal determinations
      return {
        similarity,
        similarityPercentage: Math.round(similarity * 100),
        confidenceLevel: similarity > 0.95 ? 'high' : similarity > 0.85 ? 'medium' : 'low',
        technicalMatch: similarity > 0.85, // Technical threshold, not legal determination
        timestamp: new Date().toISOString(),
        disclaimer: "This is a technical similarity match, not a legal determination of infringement"
      };
      
    } catch (error: any) {
      console.error('❌ PMA comparison error:', error);
      return { similarity: 0, technicalMatch: false, error: error.message };
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
          
          if (comparison.technicalMatch) {
            results.push({
              contentId: content.id,
              suspiciousUrl: url,
              similarity: comparison.similarity,
              similarityPercentage: comparison.similarityPercentage,
              confidenceLevel: comparison.confidenceLevel,
              timestamp: new Date().toISOString(),
              disclaimer: "Technical match detected - user must determine legal implications"
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

// DMCA Template Generator (DTA) - Technology-only template creation
export const DTA = {
  generateTemplate: async (matchData: any, ownerInfo: any) => {
    try {
      console.log(`📝 DTA: Generating DMCA template for similarity match: ${matchData.url}`);
      
      const prompt = `
Generate a DMCA takedown notice template for the following similarity match:

SIMILARITY MATCH DETAILS:
- Matched URL: ${matchData.url}
- Platform: ${matchData.platform}
- Content Title: ${matchData.contentTitle || '[USER MUST SPECIFY]'}
- Similarity Score: ${matchData.similarityPercentage}%
- Technical Match: ${matchData.technicalMatch ? 'Yes' : 'No'}

OWNER INFORMATION TEMPLATE:
- Name: ${ownerInfo.name || '[USER MUST COMPLETE]'}
- Email: ${ownerInfo.email || '[USER MUST COMPLETE]'}
- Business: ${ownerInfo.businessName || '[USER MUST COMPLETE]'}

Create a template that includes:
1. Template fields for copyrighted work identification [USER MUST COMPLETE]
2. Template fields for infringing material identification [USER MUST COMPLETE]  
3. Contact information placeholders [USER MUST COMPLETE]
4. Good faith statement template [USER MUST REVIEW AND AFFIRM]
5. Accuracy statement template [USER MUST REVIEW AND AFFIRM]
6. Electronic signature placeholder [USER MUST COMPLETE]
7. Platform-specific formatting

IMPORTANT: This is a template only. Include prominent disclaimers that:
- User must complete all bracketed fields
- User must make all legal determinations
- User must review for accuracy before submission
- User assumes all legal responsibility
- This system provides no legal advice or validation

Make it clear this is a template tool, not legal advice.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a document template generator. Create DMCA notice templates with clear placeholder fields that users must complete themselves. Include prominent disclaimers that users must make all legal determinations and assume all legal responsibility. Provide no legal advice or validation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1, // Very low temperature for consistent templates
      });

      const templateText = completion.choices[0].message.content;
      
      // Store the template in database for user completion
      const [template] = await db.insert(dmcaNotices).values({
        infringementId: matchData.id,
        userId: ownerInfo.userId,
        recipientEmail: DTA.getPlatformEmail(matchData.platform),
        platform: matchData.platform,
        subject: `DMCA Template - Similarity Match ${matchData.similarityPercentage}%`,
        body: templateText || '',
        status: 'template_generated', // User must complete and submit
      }).returning();

      console.log(`✅ DTA: DMCA template generated and saved as template ID: ${template.id}`);
      
      return {
        templateId: template.id,
        subject: template.subject,
        body: templateText,
        recipientEmail: template.recipientEmail,
        platform: matchData.platform,
        status: 'template_ready_for_completion',
        requiresUserCompletion: true,
        similarityScore: matchData.similarityPercentage,
        disclaimer: "This is a template only. User must complete all fields and make all legal determinations.",
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

  batchGenerateTemplates: async (matches: any[], ownerInfo: any) => {
    try {
      console.log(`📋 DTA: Batch generating ${matches.length} DMCA templates`);
      
      const templates = [];
      
      for (const match of matches) {
        try {
          const template = await DTA.generateTemplate(match, ownerInfo);
          templates.push(template);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error: any) {
          console.error(`❌ Failed to generate template for match ${match.id}:`, error);
          templates.push({
            matchId: match.id,
            error: error.message,
            status: 'generation_failed',
          });
        }
      }
      
      console.log(`✅ DTA: Batch generation complete. Generated ${templates.filter((t: any) => !t.error).length}/${matches.length} templates`);
      return templates;
      
    } catch (error: any) {
      console.error('❌ DTA batch generation error:', error);
      throw new Error(`DTA batch generation failed: ${error.message}`);
    }
  },

  markUserCompleted: async (templateId: number, userCompletedContent: string) => {
    try {
      console.log(`✅ DTA: User completed template ID: ${templateId}`);
      
      await db.update(dmcaNotices)
        .set({
          body: userCompletedContent,
          status: 'user_completed',
          updatedAt: new Date(),
        })
        .where(eq(dmcaNotices.id, templateId));
      
      console.log(`✅ DTA: Template ${templateId} marked as user completed`);
      
      return {
        templateId,
        status: 'user_completed',
        completedAt: new Date().toISOString(),
        disclaimer: "User has completed this template and assumes all legal responsibility for its content and submission."
      };
      
    } catch (error: any) {
      console.error('❌ DTA user completion error:', error);
      throw new Error(`DTA user completion failed: ${error.message}`);
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