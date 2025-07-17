const { Worker } = require('worker_threads');
const path = require('path');
const cron = require('node-cron');

class AgentOrchestrator {
  constructor() {
    this.workers = new Map();
    this.isRunning = false;
  }

  async startAgents() {
    if (this.isRunning) {
      console.log('Agents already running');
      return;
    }

    console.log('Starting KlinkyLinks agent orchestrator...');
    this.isRunning = true;

    // Schedule monitoring every hour
    cron.schedule('0 * * * *', () => {
      this.runStealthCrawler();
    });

    // Schedule screenshot capture every 30 minutes
    cron.schedule('*/30 * * * *', () => {
      this.runScreenshotCapture();
    });

    // Schedule DMCA processing every 2 hours
    cron.schedule('0 */2 * * *', () => {
      this.runDmcaAgent();
    });

    console.log('All agents scheduled and running');
  }

  async runStealthCrawler() {
    try {
      console.log('Starting stealth crawler...');
      
      const worker = new Worker(path.join(__dirname, 'stealth-crawler.js'));
      this.workers.set('stealth-crawler', worker);

      worker.on('message', (data) => {
        console.log('Stealth crawler result:', data);
      });

      worker.on('error', (error) => {
        console.error('Stealth crawler error:', error);
      });

      worker.on('exit', (code) => {
        console.log(`Stealth crawler exited with code ${code}`);
        this.workers.delete('stealth-crawler');
      });

    } catch (error) {
      console.error('Error starting stealth crawler:', error);
    }
  }

  async runPerceptualMatcher() {
    try {
      console.log('Starting perceptual matcher...');
      
      const worker = new Worker(path.join(__dirname, 'perceptual-matcher.js'));
      this.workers.set('perceptual-matcher', worker);

      worker.on('message', (data) => {
        console.log('Perceptual matcher result:', data);
      });

      worker.on('error', (error) => {
        console.error('Perceptual matcher error:', error);
      });

      worker.on('exit', (code) => {
        console.log(`Perceptual matcher exited with code ${code}`);
        this.workers.delete('perceptual-matcher');
      });

    } catch (error) {
      console.error('Error starting perceptual matcher:', error);
    }
  }

  async runScreenshotCapture() {
    try {
      console.log('Starting screenshot capture...');
      
      const worker = new Worker(path.join(__dirname, 'capture-screenshots.js'));
      this.workers.set('screenshot-capture', worker);

      worker.on('message', (data) => {
        console.log('Screenshot capture result:', data);
      });

      worker.on('error', (error) => {
        console.error('Screenshot capture error:', error);
      });

      worker.on('exit', (code) => {
        console.log(`Screenshot capture exited with code ${code}`);
        this.workers.delete('screenshot-capture');
      });

    } catch (error) {
      console.error('Error starting screenshot capture:', error);
    }
  }

  async runDmcaAgent() {
    try {
      console.log('Starting DMCA agent...');
      
      const worker = new Worker(path.join(__dirname, 'dmca-agent.js'));
      this.workers.set('dmca-agent', worker);

      worker.on('message', (data) => {
        console.log('DMCA agent result:', data);
      });

      worker.on('error', (error) => {
        console.error('DMCA agent error:', error);
      });

      worker.on('exit', (code) => {
        console.log(`DMCA agent exited with code ${code}`);
        this.workers.delete('dmca-agent');
      });

    } catch (error) {
      console.error('Error starting DMCA agent:', error);
    }
  }

  async stopAgents() {
    console.log('Stopping all agents...');
    
    for (const [name, worker] of this.workers) {
      console.log(`Terminating ${name}...`);
      await worker.terminate();
    }
    
    this.workers.clear();
    this.isRunning = false;
    console.log('All agents stopped');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      activeWorkers: Array.from(this.workers.keys()),
      workerCount: this.workers.size,
    };
  }
}

// Export singleton instance
const orchestrator = new AgentOrchestrator();

// Start agents if this script is run directly
if (require.main === module) {
  orchestrator.startAgents();
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down gracefully...');
    await orchestrator.stopAgents();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    await orchestrator.stopAgents();
    process.exit(0);
  });
}

module.exports = orchestrator;
