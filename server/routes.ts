import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContentItemSchema } from "@shared/schema";
import Stripe from "stripe";
import multer from "multer";
import { generateDmcaNotice, analyzeContent, generateFingerprint } from "./services/openai";
import { startMonitoring } from "./services/monitoring";
import { setupAuth, isAuthenticated } from "./replitAuth";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/dashboard/recent-similarity-matches", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const matches = await storage.getInfringements(userId, 10);
      res.json(matches);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Content routes
  app.get("/api/content", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contentItems = await storage.getContentItems(userId);
      res.json(contentItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/content/upload", isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.claims.sub;
      const { title, description } = req.body;
      
      // Analyze content with OpenAI
      const base64Data = req.file.buffer.toString('base64');
      const analysis = await analyzeContent(base64Data, req.file.mimetype);
      const fingerprint = await generateFingerprint(base64Data);
      
      // TODO: Upload to S3 in production
      const s3Key = `content/${userId}/${Date.now()}-${req.file.originalname}`;
      const s3Url = `https://your-bucket.s3.amazonaws.com/${s3Key}`;

      const contentItem = await storage.createContentItem({
        userId,
        filename: req.file.originalname,
        originalFilename: req.file.originalname,
        contentType: analysis.contentType,
        fileSize: req.file.size,
        s3Key,
        s3Url,
        fingerprint,
        metadata: { 
          title: title || analysis.suggestedTitle, 
          description: description || analysis.description,
          tags: analysis.tags,
          aiAnalysis: analysis
        },
      });

      // Start monitoring for this content
      await startMonitoring(contentItem.id, userId);

      res.json(contentItem);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/content", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const content = await storage.getContentItems(userId);
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Infringement routes
  app.get("/api/infringements", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const infringements = await storage.getInfringements(userId);
      res.json(infringements);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/infringements/:id/dmca", async (req, res) => {
    try {
      const infringementId = parseInt(req.params.id);
      const infringement = await storage.getInfringement(infringementId);
      
      if (!infringement) {
        return res.status(404).json({ message: "Infringement not found" });
      }

      // Generate DMCA notice using OpenAI
      const dmcaText = await generateDmcaNotice({
        platform: infringement.platform,
        infringingUrl: infringement.url,
        contentDescription: infringement.title || 'Protected content',
      });

      const notice = await storage.createDmcaNotice({
        infringementId,
        userId: infringement.userId,
        platform: infringement.platform,
        subject: `DMCA Takedown Notice - ${infringement.title}`,
        body: dmcaText,
        status: 'pending',
      });

      res.json(notice);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // DMCA routes
  app.get("/api/dmca", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notices = await storage.getDmcaNotices(userId);
      res.json(notices);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/dmca/:id/approve", async (req, res) => {
    try {
      const noticeId = parseInt(req.params.id);
      const notice = await storage.approveDmca(noticeId);
      
      // Update infringement status
      await storage.updateInfringementStatus(notice.infringementId, 'dmca_sent');
      
      res.json(notice);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Monitoring routes
  app.post("/api/monitoring/manual-scan", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { contentId } = req.body;
      
      const scan = await storage.createMonitoringScan({
        userId,
        contentId,
        platform: 'manual',
        query: 'manual scan',
        status: 'pending',
      });

      // Trigger manual monitoring
      await startMonitoring(contentId, userId);

      res.json({ message: "Manual scan initiated", scanId: scan.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment routes
  app.post("/api/create-subscription", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const { priceId } = req.body;
      
      if (!user?.email) {
        return res.status(400).json({ message: "User email not found" });
      }
      
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId || process.env.STRIPE_PRICE_ID }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(userId, customer.id, subscription.id);

      res.json({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Stripe webhook
  app.post("/api/stripe/webhook", async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'] as string;
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user by Stripe customer ID and update subscription status
        // This would require additional storage method
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // AI Agent API Routes (Core Agents Integration)
  app.get("/api/agents/status", isAuthenticated, async (req: any, res) => {
    try {
      const status = {
        POA: 'active',
        SCA: 'active', 
        PMA: 'active',
        DTA: 'active',
        orchestrator: 'running',
        timestamp: new Date().toISOString(),
      };
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/agents/scan", isAuthenticated, async (req: any, res) => {
    try {
      const { query, platforms } = req.body;
      const userId = req.user.claims.sub;
      
      // Import and use the core agents
      const { SCA } = await import('./agents/coreAgents.js');
      const results = await SCA.crawl(query, platforms || ['google', 'bing']);
      
      res.json({
        message: "Scan initiated successfully",
        query,
        platforms: platforms || ['google', 'bing'],
        results,
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/agents/fingerprint", isAuthenticated, async (req: any, res) => {
    try {
      const { contentId } = req.body;
      const userId = req.user.claims.sub;
      
      const content = await storage.getContentItem(contentId);
      if (!content || content.userId !== userId) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      const { PMA } = await import('./agents/coreAgents.js');
      const fingerprint = await PMA.generateFingerprint(content);
      
      res.json({
        message: "Fingerprint generated successfully",
        contentId,
        fingerprint,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/agents/dmca/generate", isAuthenticated, async (req: any, res) => {
    try {
      const { infringementId } = req.body;
      const userId = req.user.claims.sub;
      
      const infringement = await storage.getInfringement(infringementId);
      if (!infringement || infringement.userId !== userId) {
        return res.status(404).json({ message: "Infringement not found" });
      }
      
      const user = await storage.getUser(userId);
      const ownerInfo = {
        userId,
        name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Content Owner',
        email: user?.email || 'owner@example.com',
        businessName: 'Content Protection Agency',
      };
      
      const { DTA } = await import('./agents/coreAgents.js');
      const notice = await DTA.generateNotice(infringement, ownerInfo);
      
      res.json({
        message: "DMCA notice generated successfully",
        notice,
        requiresApproval: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/agents/dmca/approve", isAuthenticated, async (req: any, res) => {
    try {
      const { noticeId, approved, comments } = req.body;
      
      const { DTA } = await import('./agents/coreAgents.js');
      const result = await DTA.reviewAndApprove(noticeId, approved, comments);
      
      res.json({
        message: `Notice ${approved ? 'approved' : 'rejected'} successfully`,
        result,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/agents/monitor", isAuthenticated, async (req: any, res) => {
    try {
      const { POA } = await import('./agents/coreAgents.js');
      const healthStatus = await POA.monitor();
      
      res.json({
        message: "System monitoring completed",
        healthStatus,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/agents/batch-analysis", isAuthenticated, async (req: any, res) => {
    try {
      const { contentIds, suspiciousUrls } = req.body;
      const userId = req.user.claims.sub;
      
      // Get content items for the user
      const contentItems = [];
      for (const contentId of contentIds) {
        const content = await storage.getContentItem(contentId);
        if (content && content.userId === userId) {
          contentItems.push(content);
        }
      }
      
      if (contentItems.length === 0) {
        return res.status(404).json({ message: "No valid content items found" });
      }
      
      const { PMA } = await import('./agents/coreAgents.js');
      const results = await PMA.analyzeContentBatch(contentItems, suspiciousUrls);
      
      res.json({
        message: "Batch analysis completed",
        results,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Monitoring routes
  app.get("/api/monitoring/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Return platform monitoring status
      const platforms = [
        {
          id: 'google_images',
          name: 'Google™ Images',
          icon: '🔍',
          status: 'active',
          lastScan: '14 hours ago',
          itemsFound: 0,
          enabled: true,
        },
        {
          id: 'google_videos',
          name: 'Google™ Videos',
          icon: '🎥',
          status: 'active',
          lastScan: '18 hours ago',
          itemsFound: 0,
          enabled: true,
        },
        {
          id: 'bing_images',
          name: 'Bing® Images',
          icon: '🔎',
          status: 'active',
          lastScan: '22 hours ago',
          itemsFound: 0,
          enabled: true,
        },
        {
          id: 'bing_videos',
          name: 'Bing® Videos',
          icon: '📹',
          status: 'active',
          lastScan: '16 hours ago',
          itemsFound: 0,
          enabled: true,
        },
      ];
      res.json(platforms);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/monitoring/schedule-scan", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Schedule a new monitoring scan
      await storage.createMonitoringScan({
        userId,
        platforms: ['google_images', 'google_videos', 'bing_images', 'bing_videos'],
        status: 'scheduled',
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      });
      
      res.json({ message: "Scan scheduled successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
