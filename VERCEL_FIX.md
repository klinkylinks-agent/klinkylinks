# VERCEL DEPLOYMENT FIX

## Problem
The site is showing 404 errors because Vercel can't find the built files.

## IMMEDIATE SOLUTION

Replace the vercel.json content with this simplified configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "functions": {
    "server/index.ts": {
      "maxDuration": 30
    }
  }
}
```

## HOW TO APPLY

1. Go to GitHub: https://github.com/klinkylinks-agent/klinkylinks
2. Click on vercel.json
3. Click Edit (pencil icon)
4. Replace ALL content with the JSON above
5. Commit: "Simplify Vercel routing with filesystem handler"

## WHAT THIS DOES

- Uses "handle": "filesystem" to automatically serve static files
- Simpler routing that matches Vercel's expected patterns
- Explicitly sets distDir to match our build output

This should resolve the 404 immediately after deployment.