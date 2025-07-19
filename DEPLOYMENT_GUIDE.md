# KlinkyLinks Production Deployment Guide

## Prerequisites

1. **GitHub Account** - For code repository
2. **Vercel Account** - For hosting (free tier available)
3. **Database** - Either:
   - Neon PostgreSQL (recommended, free tier)
   - Any PostgreSQL provider (Supabase, Railway, etc.)

## Step 1: Extract Files

1. Download and extract `klinkylinks-production-final-verified.tar.gz`
2. Create new GitHub repository (private or public)
3. Upload all extracted files to your GitHub repository

## Step 2: Set Up Database

### Option A: Neon (Recommended)
1. Go to https://neon.tech
2. Sign up for free account
3. Create new project called "klinkylinks"
4. Copy the connection string (starts with `postgresql://`)

### Option B: Other PostgreSQL Provider
1. Create PostgreSQL database
2. Get connection string in format: `postgresql://username:password@host:port/database`

## Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Select your KlinkyLinks repository
5. Configure deployment:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist/public`

## Step 4: Configure Environment Variables

In Vercel dashboard, go to Settings > Environment Variables and add:

```
DATABASE_URL=postgresql://your_connection_string_here
SESSION_SECRET=your_random_secret_here_32_chars_minimum
OPENAI_API_KEY=sk-your_openai_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
```

### Generate SESSION_SECRET
Use any of these methods:
- Online: https://generate-secret.vercel.app/32
- Node.js: `require('crypto').randomBytes(32).toString('hex')`
- Command line: `openssl rand -hex 32`

## Step 5: API Keys Setup

### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and paste into OPENAI_API_KEY

### Stripe Keys (for payments)
1. Go to https://dashboard.stripe.com/apikeys
2. Copy "Publishable key" (pk_test_) → VITE_STRIPE_PUBLIC_KEY
3. Copy "Secret key" (sk_test_) → STRIPE_SECRET_KEY

## Step 6: Deploy and Test

1. Click "Deploy" in Vercel
2. Wait for deployment to complete
3. Test your site at the provided .vercel.app URL
4. Test registration and login functionality

## Step 7: Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain (e.g., klinkylinks.com)
3. Configure DNS records as instructed by Vercel
4. Wait for SSL certificate provisioning

## Troubleshooting

### Registration Fails
- Check DATABASE_URL is correct
- Verify SESSION_SECRET is at least 32 characters
- Check Vercel function logs

### Database Connection Issues
- Ensure database allows external connections
- Verify connection string format
- Check database user permissions

### Build Fails
- Ensure all dependencies in package.json
- Check for TypeScript errors
- Verify file structure is correct

## Fallback Authentication

If database connection fails, the system automatically switches to emergency in-memory authentication for basic functionality. This ensures your site stays online even during database issues.

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables are set
3. Test database connection string separately
4. Contact support with specific error messages