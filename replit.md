# KlinkyLinks - Content Protection SaaS

## Overview

KlinkyLinks is a modern content protection Software-as-a-Service platform designed specifically for content creators. The application provides comprehensive DMCA monitoring, automated infringement detection, and streamlined takedown notice generation across multiple search platforms including Google Images/Videos and Bing Images/Videos.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom neon/electric blue theme optimized for Gen Alpha users
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Custom user management with planned Clerk integration
- **Payment Processing**: Stripe integration for subscription billing

### Key Components

#### Database Schema
- **Users**: Authentication, subscription management, Stripe customer data
- **Content Items**: File storage with S3, perceptual fingerprinting, metadata
- **Infringements**: Violation tracking across platforms with similarity scoring
- **DMCA Notices**: Automated notice generation with approval workflow
- **Monitoring Scans**: Background job tracking and scan history

#### Content Protection Pipeline
1. **Upload & Fingerprinting**: File upload to S3 with OpenAI-powered content analysis
2. **Multi-Platform Monitoring**: Automated scanning across Google/Bing search engines
3. **Perceptual Matching**: Image similarity detection using sharp image processing
4. **Screenshot Capture**: Evidence collection using Puppeteer for visual confirmation
5. **DMCA Generation**: AI-powered legal notice creation with OpenAI GPT-4
6. **Human-in-the-Loop**: Manual approval workflow for takedown notices
7. **Automated Sending**: Email delivery via SendGrid with tracking

#### Background Services
- **Agent Orchestrator**: Coordinates multiple monitoring agents using worker threads
- **Stealth Crawler**: Multi-platform search monitoring with rate limiting
- **Perceptual Matcher**: Image similarity analysis and fingerprint comparison
- **Screenshot Agent**: Automated evidence capture and S3 storage
- **DMCA Agent**: Legal notice generation and platform-specific formatting

## Data Flow

1. **Content Upload**: Users upload content via drag-and-drop interface
2. **Fingerprint Generation**: Perceptual hashing creates unique content signatures
3. **Monitoring Activation**: Background agents scan search platforms every hour
4. **Infringement Detection**: Similarity algorithms identify potential violations
5. **Evidence Capture**: Screenshots and metadata collected for legal documentation
6. **DMCA Generation**: AI creates platform-specific takedown notices
7. **Review & Approval**: Human oversight ensures notice accuracy
8. **Automated Delivery**: Notices sent to platform abuse teams
9. **Status Tracking**: Real-time updates on takedown progress

## External Dependencies

### APIs & Services
- **OpenAI GPT-4**: DMCA notice generation and content analysis
- **Google Custom Search API**: Image and video search monitoring
- **Bing Search API**: Alternative platform monitoring
- **AWS S3**: Secure file storage and content delivery
- **SendGrid**: Transactional email delivery and DMCA sending
- **Stripe**: Subscription billing and payment processing
- **Neon Database**: Serverless PostgreSQL hosting

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **Vite**: Frontend build system with HMR
- **ESBuild**: Server-side TypeScript compilation
- **Replit**: Development environment integration

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express API proxy
- **Database**: Neon serverless PostgreSQL with connection pooling
- **File Storage**: AWS S3 with development bucket isolation
- **Environment Variables**: Secure API key management for all services

### Production Deployment
- **Frontend**: Static build served from `dist/public`
- **Backend**: Node.js server compiled with ESBuild
- **Database**: Production PostgreSQL with migration scripts
- **Background Jobs**: Worker thread orchestration with cron scheduling
- **Monitoring**: Comprehensive error tracking and performance monitoring

### Scalability Considerations
- **Database**: Connection pooling with Neon serverless scaling
- **File Storage**: S3 CDN integration for global content delivery
- **Background Processing**: Horizontal scaling with worker thread distribution
- **API Rate Limiting**: Intelligent throttling for search platform compliance
- **Caching**: Query optimization with React Query and database indexes

The architecture prioritizes user experience with a modern, responsive interface while maintaining robust backend processing for accurate content protection and legal compliance.

## Recent Changes (2025-07-17)

### Fixed Application Startup Issues
- ✓ Resolved OpenAI API key requirement
- ✓ Resolved Stripe API key requirement  
- ✓ Fixed JSX syntax error in billing page
- ✓ App successfully running on port 5000
- ✓ All backend services operational

### Core Agents Implementation (Blueprint Integration)
- ✓ Created coreAgents.ts with POA, SCA, PMA, and DTA cognitive agents
- ✓ Implemented OpenAI GPT-4o integration for DMCA notice generation
- ✓ Added comprehensive background worker system (scripts/background-workers.js)
- ✓ Enhanced database schema with agent logs and monitoring tables (init-db.sql)
- ✓ Added 7 new API endpoints for agent control (/api/agents/*)
- ✓ Integrated scheduled scanning, fingerprinting, and DMCA processing
- ✓ Maintained Gen Z/Alpha aesthetic throughout all implementations
- ✓ Added human-in-the-loop approval workflow for legal compliance

### Deployment Preparation & Fixes
- ✓ Created Vercel deployment configuration (vercel.json)
- ✓ Set up proper .gitignore for GitHub repository
- ✓ Created comprehensive README.md with full documentation
- ✓ Created detailed DEPLOYMENT.md guide for Vercel hosting
- ✓ Configured project for GitHub → Vercel → Custom Domain workflow

### Complete Deployment Success - Platform Live (2025-07-17)
- ✓ **REPOSITORY MISMATCH RESOLVED**: Identified GitHub had incomplete Next.js setup vs local Vite+React
- ✓ **COMPLETE REPOSITORY REPLACEMENT**: Used Git Bash to clean and reupload entire platform
- ✓ **118 FILES UPLOADED**: All directories (client/, server/, shared/) successfully synchronized
- ✓ **VERCEL DEPLOYMENT SUCCESS**: Platform automatically detected correct Vite configuration
- ✓ **CUSTOM DOMAIN ACTIVE**: klinkylinks.com and www.klinkylinks.com both operational
- ✓ **PRODUCTION STATUS**: Platform fully deployed and ready for live use
- ✓ **BUILD OPTIMIZATION**: Vercel correctly processing TypeScript (87.5%) and assets
- ✓ **SSL CERTIFICATES**: Secure HTTPS connections established automatically

### Repository Structure Cleanup (2025-07-17)
- ✓ **Git Repository Fixed**: Removed all duplicate coreAgents.ts files from GitHub
- ✓ **Directory Structure**: Cleaned /src/, /api/ conflicts, established proper /client/, /server/, /shared/
- ✓ **Force Push Success**: 387 deletions removed problematic files, 18 insertions added correct structure
- ✓ **Complete Upload Success**: All directories (/client/, /server/, /shared/) now present on GitHub
- ✓ **Vercel Configuration Fixed**: Updated vercel.json routing to match actual build output
- ✓ **Build Process Verified**: Local npm run build working perfectly, generates dist/public/ output

### Functional Testing Results
- ✓ Database connectivity verified (PostgreSQL with all tables)
- ✓ Authentication system working (registration/login)
- ✓ Core API endpoints responding correctly
- ✓ Dashboard stats and violation tracking functional
- ✓ External service integrations ready (OpenAI, Stripe)
- ✓ Frontend React application loading properly
- ✓ File upload system configured and ready
- ✓ Background monitoring agents architecture in place

## User Preferences

Preferred communication style: Simple, everyday language.
Deployment preference: Vercel hosting with custom domain (klinkylinks.com)
Visual Design: Modern Gen Z/Alpha aesthetic with electric purple/neon pink gradients, morphing glassmorphism cards, floating animations, and creator-focused styling

## Visual Design System (2025-07-17)

### Color Palette
- Primary: Electric purple (hsl(280, 85%, 65%)) and neon pink (hsl(320, 85%, 68%))
- Accents: Cyber blue, mint green, sunset orange
- Backgrounds: Dark gradients with purple undertones

### Design Elements
- **Morphing Cards**: Glassmorphism cards with backdrop blur and animated shimmer effects
- **Gradient Text**: Animated rainbow gradients cycling through vibrant colors
- **Floating Animations**: Subtle floating movements on interactive elements
- **Dynamic Backgrounds**: Organic blob shapes that continuously morph
- **Typography**: Bold, dramatic fonts (font-black) with larger sizes
- **Interactions**: Scale transforms, glow effects, smooth transitions

### CSS Classes for Consistency
- `.morphing-card` - Main card component with glassmorphism
- `.gradient-text` - Animated gradient text effect
- `.floating` / `.floating-delayed` - Floating animation variants
- Rounded corners: 1.5rem radius throughout
- Transitions: cubic-bezier easing for premium feel