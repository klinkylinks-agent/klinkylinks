# GitHub Repository Replacement & Vercel Deployment Guide

This guide will help you completely replace your existing GitHub repository with the new KlinkyLinks content protection platform and deploy it to Vercel.

## Step 1: Backup and Clear Repository (if needed)

Since your repository may have old/broken content, you have two options:

### Option A: Complete Repository Reset (Recommended)
```bash
# Clone your existing repository
git clone https://github.com/klinkylinks-agent/klinkylinks.git temp-backup

# Delete all contents except .git folder
cd klinkylinks
rm -rf !(.)
rm -rf .!(git)

# Or if on Windows, delete everything manually except .git folder
```

### Option B: Force Push New Content
```bash
# This will completely overwrite the repository history
# Backup important files first if needed
```

## Step 2: Copy Your New Project Files

From your current Replit project, copy all these files to your local repository:

### Essential Files to Copy:
```
├── client/                     # Entire client directory
├── server/                     # Entire server directory  
├── shared/                     # Entire shared directory
├── package.json               # Dependencies and scripts
├── package-lock.json          # Lock file for exact versions
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── drizzle.config.ts          # Database configuration
├── vercel.json                # Vercel deployment config
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
├── DEPLOYMENT.md              # Deployment guide
├── replit.md                  # Project context
└── GITHUB_DEPLOYMENT.md       # This file
```

## Step 3: Push to GitHub

```bash
# Initialize git if needed
git init

# Add all files
git add .

# Commit with descriptive message
git commit -m "Complete rewrite: KlinkyLinks content protection platform

- Modern React/TypeScript frontend with Tailwind CSS
- Node.js/Express backend with PostgreSQL
- OpenAI integration for DMCA generation
- Stripe payment processing
- Multi-platform content monitoring
- Automated infringement detection
- Screenshot evidence capture
- Background monitoring agents"

# Add remote if not already added
git remote add origin https://github.com/klinkylinks-agent/klinkylinks.git

# Force push to completely replace repository content
git push -f origin main
```

## Step 4: Configure Vercel Environment Variables

Since Vercel is already connected, go to your Vercel dashboard and add these environment variables:

### Required for Basic Functionality:
```
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key  
STRIPE_SECRET_KEY=your_stripe_secret_key
NODE_ENV=production
```

### Optional for Full Features:
```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
SENDGRID_API_KEY=your_sendgrid_api_key
GOOGLE_SEARCH_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
BING_SEARCH_API_KEY=your_bing_api_key
```

**Important**: Set these for Production, Preview, and Development environments.

## Step 5: Trigger Vercel Deployment

Once you push to GitHub, Vercel should automatically trigger a new deployment. You can:

1. **Check deployment status** in your Vercel dashboard
2. **Monitor build logs** for any issues
3. **Test the deployment** once it completes

## Step 6: Configure Custom Domain

In your Vercel project settings:

1. Go to **Domains** section
2. Add your domain: `klinkylinks.com`
3. Add www subdomain: `www.klinkylinks.com`
4. Configure DNS records as shown by Vercel

### DNS Configuration:
```
Type: A
Name: @
Value: 76.76.19.61 (Vercel's IP)

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

## Step 7: Database Setup

### Option 1: Neon Database (Recommended)
```bash
# Create account at https://neon.tech
# Create new database
# Copy connection string to Vercel environment variables
```

### Option 2: Existing Database
```bash
# Use your current PostgreSQL database
# Update DATABASE_URL in Vercel environment variables
```

### Initialize Database Schema:
```bash
# Run this locally after setting up DATABASE_URL
npm install
npm run db:push
```

## Step 8: Verification Checklist

After deployment completes:

- [ ] Visit https://klinkylinks.com - should load the app
- [ ] Check https://klinkylinks.com/api/dashboard/stats/1 - should return JSON
- [ ] Test user registration functionality
- [ ] Verify Stripe integration works
- [ ] Confirm OpenAI integration functions
- [ ] Check all navigation pages load correctly
- [ ] Test file upload functionality
- [ ] Verify responsive design on mobile

## Step 9: Post-Deployment Tasks

1. **Set up monitoring** in Vercel dashboard
2. **Configure error tracking** (optional Sentry integration)
3. **Enable Vercel Analytics** for performance insights
4. **Set up automated backups** for your database
5. **Configure webhook endpoints** for Stripe if needed

## Troubleshooting Common Issues

### Build Failures:
- Check Vercel build logs for specific errors
- Verify all environment variables are set
- Ensure package.json includes all dependencies

### API Not Working:
- Confirm vercel.json routing configuration
- Check server/index.ts structure
- Verify database connection string format

### Domain Issues:
- DNS propagation can take up to 48 hours
- Use DNS checker tools to verify records
- Ensure domain is properly configured in Vercel

### Database Connection:
- Verify DATABASE_URL format includes SSL parameters
- Check if database allows external connections
- Confirm connection string credentials

## Expected Result

After following this guide:
- Your old repository content is completely replaced
- New KlinkyLinks platform is deployed to Vercel
- Custom domain (klinkylinks.com) points to your app
- All core functionality works (auth, payments, AI features)
- Professional content protection platform is live and ready for users

The deployment should happen automatically once you push to GitHub, thanks to your existing Vercel connection.