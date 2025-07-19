# KlinkyLinks

Self-operating, AI-driven SaaS per Comprehensive Master Automation Blueprint (2025 Edition) - Enhanced for Replit Compatibility.

## Purpose
Autonomous digital protection and growth system for content creators/SMBs. Uses AI agents for infringement detection, DMCA facilitation, UX optimization, and revenue management. Replit-hosted for solo ops.

## Setup in Replit
1. Import from GitHub or create new Node.js Repl.
2. Run `npm install`.
3. Add keys to Secrets panel (e.g., OPENAI_API_KEY).
4. Run `npm run dev` for frontend/backend.
5. Run `node scripts/background-workers.js` for agents (enable 'Always On').

## Key Features (Per Blueprint)
- AI Agents: coreAgents.ts for SCA (scanning), PMA (fingerprinting), DTA (DMCA drafts/CTAs).
- Database: Neon PostgreSQL integration.
- Auth: Replit Auth.
- Payments: Stripe.
- Compliance: HITL for notices.

## Agents
Cognitive agents in coreAgents.ts with self-scoring and orchestration.

A modern content protection Software-as-a-Service platform designed for content creators to monitor, detect, and respond to copyright infringement across multiple search platforms.

## Features

<!-- Deployment trigger: Authentication system updated Jul 18, 2025 -->
- **Content Upload & Fingerprinting**: Secure file upload with AI-powered content analysis
- **Multi-Platform Monitoring**: Automated scanning across Google Images/Videos and Bing
- **Infringement Detection**: Perceptual matching and similarity scoring for violation detection
- **DMCA Notice Generation**: AI-powered legal notice creation using OpenAI GPT-4
- **Screenshot Evidence**: Automated evidence capture for legal documentation
- **Human-in-the-Loop Approval**: Manual review workflow for takedown notices
- **Subscription Billing**: Stripe integration for payment processing
- **Real-time Dashboard**: Comprehensive analytics and violation tracking

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS with custom neon theme
- Radix UI components with shadcn/ui
- TanStack React Query for state management
- Wouter for routing
- Vite for build tooling

### Backend
- Node.js with Express.js
- TypeScript with ES modules
- PostgreSQL with Drizzle ORM
- Neon serverless database
- Stripe for payments
- OpenAI GPT-4 for AI features

### External Services
- OpenAI API for content analysis and DMCA generation
- Google Custom Search API for monitoring
- Bing Search API for platform coverage
- AWS S3 for file storage
- SendGrid for email delivery
- Stripe for subscription billing

## Environment Variables

Required environment variables for deployment:

```
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name
SENDGRID_API_KEY=your_sendgrid_api_key
GOOGLE_SEARCH_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_custom_search_engine_id
BING_SEARCH_API_KEY=your_bing_api_key
```

## Deployment to Vercel

1. **Push to GitHub**: Create a new repository and push your code
2. **Connect to Vercel**: Link your GitHub repository to Vercel
3. **Environment Variables**: Add all required environment variables in Vercel dashboard
4. **Deploy**: Vercel will automatically build and deploy your application
5. **Custom Domain**: Configure your domain (klinkylinks.com) in Vercel settings

## Local Development

1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Initialize database: `npm run db:push`
4. Start development server: `npm run dev`

## Database Schema

The application uses PostgreSQL with the following tables:
- `users` - User authentication and subscription data
- `content_items` - Uploaded content with fingerprints
- `infringements` - Detected violations with evidence
- `dmca_notices` - Generated takedown notices
- `monitoring_scans` - Background job tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Dashboard
- `GET /api/dashboard/stats/:userId` - Dashboard statistics
- `GET /api/dashboard/recent-violations/:userId` - Recent violations

### Content Management
- `POST /api/upload` - File upload with multipart/form-data
- `GET /api/content/:userId` - Get user's content items

### Infringement Tracking
- `GET /api/infringements/:userId` - Get user's infringements
- `POST /api/infringements/:id/dmca` - Generate DMCA notice

### DMCA Management
- `GET /api/dmca/:userId` - Get DMCA notices
- `POST /api/dmca/:id/approve` - Approve DMCA notice

### Monitoring
- `POST /api/monitoring/manual-scan` - Trigger manual scan

### Payments
- `POST /api/create-subscription` - Create Stripe subscription
- `POST /api/stripe/webhook` - Stripe webhook handler

## License

MIT License - see LICENSE file for details.