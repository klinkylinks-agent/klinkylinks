#!/bin/bash

# KlinkyLinks GitHub Deployment Script
# This script will completely replace your existing repository with the new content

echo "🚀 Starting KlinkyLinks deployment to GitHub..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Set your repository URL
REPO_URL="https://github.com/klinkylinks-agent/klinkylinks.git"

echo "📁 Preparing files for deployment..."

# Remove any existing git remote
git remote remove origin 2>/dev/null || true

# Add your repository as origin
git remote add origin $REPO_URL

# Add all files to git
echo "📦 Adding all project files..."
git add .

# Create comprehensive commit message
echo "💾 Creating commit..."
git commit -m "Complete rewrite: KlinkyLinks content protection platform

✨ Features:
- Modern React/TypeScript frontend with Tailwind CSS
- Node.js/Express backend with PostgreSQL database
- OpenAI integration for automated DMCA notice generation
- Stripe payment processing for subscriptions
- Multi-platform content monitoring (Google, Bing)
- Automated infringement detection with similarity scoring
- Screenshot evidence capture using Puppeteer
- Background monitoring agents with orchestration
- Human-in-the-loop approval workflow
- Real-time dashboard with analytics

🛠️ Technical Stack:
- Frontend: React 18, TypeScript, Tailwind CSS, Radix UI
- Backend: Node.js, Express, PostgreSQL, Drizzle ORM
- External APIs: OpenAI GPT-4, Stripe, AWS S3, SendGrid
- Build: Vite, ESBuild, TypeScript compilation
- Deployment: Vercel with custom domain support

🔧 Configuration:
- Vercel deployment ready with vercel.json
- Environment variables configured
- Database schema with proper relations
- API endpoints for all core functionality
- File upload with S3 integration
- Payment processing with Stripe webhooks
- Background job processing architecture

📚 Documentation:
- Complete README with setup instructions
- Deployment guide for Vercel hosting
- API documentation and examples
- Environment variable specifications
- Troubleshooting guide and best practices"

# Force push to completely replace repository content
echo "🔄 Pushing to GitHub (this will replace all existing content)..."
echo "⚠️  This will completely overwrite your existing repository!"
read -p "Are you sure you want to proceed? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push -f origin main
    
    echo "✅ Successfully deployed to GitHub!"
    echo ""
    echo "🔗 Repository: $REPO_URL"
    echo "📱 If Vercel is connected, deployment should start automatically"
    echo "⚙️  Next steps:"
    echo "   1. Check Vercel dashboard for deployment status"
    echo "   2. Add environment variables in Vercel settings"
    echo "   3. Configure custom domain (klinkylinks.com)"
    echo "   4. Set up database connection"
    echo "   5. Test all functionality"
    echo ""
    echo "📖 See GITHUB_DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Deployment cancelled"
    exit 1
fi