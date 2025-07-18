# Deployment Guide: KlinkyLinks to Vercel

This guide walks you through deploying your content protection platform to Vercel and connecting it to your custom domain (klinkylinks.com).

## Step 1: Prepare Your GitHub Repository

1. **Create a new GitHub repository**:
   - Go to GitHub.com and create a new repository
   - Name it something like `klinkylinks-platform`
   - Make it private if you prefer

2. **Push your code to GitHub**:
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit your code
   git commit -m "Initial commit: KlinkyLinks content protection platform"
   
   # Add your GitHub repository as origin
   git remote add origin https://github.com/yourusername/klinkylinks-platform.git
   
   # Push to GitHub
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel**:
   - Go to https://vercel.com
   - Sign up or login (preferably with your GitHub account)

2. **Import your project**:
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Vercel will automatically detect it's a Node.js project

3. **Configure deployment settings**:
   - Framework Preset: Leave as "Other"
   - Build Command: `npm run build` (should auto-detect)
   - Output Directory: `dist/public`
   - Install Command: `npm install`

## Step 3: Set Environment Variables

In your Vercel project dashboard, go to Settings > Environment Variables and add:

### Required Variables:
```
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Optional (for full functionality):
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

**Important**: Set these for all environments (Production, Preview, Development)

## Step 4: Connect Your Custom Domain

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Click "Domains"
   - Add your domain: `klinkylinks.com` and `www.klinkylinks.com`

2. **Configure DNS (in your domain provider)**:
   Vercel will provide you with DNS records to add:
   - For `klinkylinks.com`: Add A record pointing to Vercel's IP
   - For `www.klinkylinks.com`: Add CNAME record pointing to your Vercel domain
   
3. **SSL Certificate**:
   - Vercel automatically provides SSL certificates
   - Your site will be available at `https://klinkylinks.com`

## Step 5: Database Setup

1. **Neon Database** (Recommended):
   - Sign up at https://neon.tech
   - Create a new database
   - Copy the connection string to your Vercel environment variables

2. **Run migrations**:
   ```bash
   # After deployment, in your local environment
   npm run db:push
   ```

## Step 6: Testing Your Deployment

1. **Check deployment status** in Vercel dashboard
2. **Visit your domain** to ensure it loads correctly
3. **Test API endpoints**:
   ```bash
   curl https://klinkylinks.com/api/dashboard/stats/1
   ```
4. **Monitor deployment logs** for any issues

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Vercel build logs
   - Ensure all dependencies are in package.json
   - Verify environment variables are set

2. **API Routes Not Working**:
   - Check vercel.json configuration
   - Ensure server/index.ts is properly structured
   - Verify database connection string

3. **Domain Not Loading**:
   - DNS propagation can take up to 48 hours
   - Use DNS checker tools to verify records
   - Check Vercel domain configuration

4. **Database Connection Issues**:
   - Verify DATABASE_URL format
   - Check if database allows external connections
   - Ensure connection string includes SSL parameters

### Performance Optimization:

1. **Enable Vercel Analytics** in project settings
2. **Configure caching** for static assets
3. **Monitor function execution times** in dashboard
4. **Set up error tracking** (Sentry integration available)

## Post-Deployment Checklist

- [ ] Application loads at klinkylinks.com
- [ ] SSL certificate is active (https://)
- [ ] API endpoints respond correctly
- [ ] Database connection is working
- [ ] File uploads function properly
- [ ] Stripe payments are configured
- [ ] OpenAI API integration works
- [ ] Error monitoring is set up
- [ ] DNS records are properly configured
- [ ] Performance monitoring enabled

## Ongoing Maintenance

1. **Automatic Deployments**: Vercel auto-deploys on git pushes
2. **Monitoring**: Check Vercel dashboard for performance metrics
3. **Updates**: Regular dependency updates via dependabot
4. **Backups**: Ensure database backups are configured
5. **Scaling**: Vercel handles automatic scaling

Your content protection platform will be live at https://klinkylinks.com once all steps are completed!