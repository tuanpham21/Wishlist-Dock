# Deployment Guide

This guide covers various deployment options for the Wishlist Dock Widget, from simple CDN hosting to full-stack deployments.

## Table of Contents

- [Build Overview](#build-overview)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [AWS Deployment](#aws-deployment)
- [Self-Hosting](#self-hosting)
- [CDN Hosting](#cdn-hosting)
- [Web Component Deployment](#web-component-deployment)
- [Environment Variables](#environment-variables)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Build Overview

The project produces two main build outputs:

### React Application Build

```bash
npm run build
```

- **Output**: `dist/` directory
- **Contains**: Single-page React application
- **Size**: ~380KB (gzipped: ~115KB)
- **Use case**: Standalone application or demo

### Library Build

```bash
# Development library build
npm run build:lib

# Production library build
npm run build:lib:prod
```

- **Output**: `dist/` directory
- **Contains**:
  - `wishlist-dock.es.js` - ES module
  - `wishlist-dock.umd.js` - UMD bundle
  - `wishlist-dock.css` - Styles
  - Type definitions (`.d.ts`)
- **Use case**: Embedding in other websites

### Library Preview

```bash
# Build and preview library version
npm run preview:lib
```

- **Server**: `http://localhost:4173`
- **Purpose**: Test the library build before deployment
- **Includes**: Both ES and UMD bundles with proper asset loading

## Vercel Deployment

Vercel is the recommended deployment platform for its simplicity and performance.

### Automatic Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Link project
   vercel link
   ```

2. **Deploy**
   ```bash
   # Deploy to production
   npm run deploy

   # Or using vercel directly
   vercel --prod

   # Deploy preview for PR
   vercel
   ```

### Vercel Configuration

The project includes `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": "vite"
}
```

### Custom Domain

```bash
# Add custom domain
vercel domains add yourdomain.com
```

### Environment Variables

```bash
# Set environment variables
vercel env add API_URL
vercel env add NODE_ENV production
```

## Netlify Deployment

### Build Configuration

Create `netlify.toml`:

```toml
[build]
  base = "/"
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  NODE_ENV = "production"
```

### Deployment via Git

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`
   - Node version: 18

### Manual Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## AWS Deployment

### S3 + CloudFront

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Upload to S3**
   ```bash
   # Using AWS CLI
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront**
   ```json
   {
     "Origin": {
       "S3OriginConfig": {
         "OriginAccessIdentity": "origin-access-identity/cloudfront/XXXXXXXXX"
       }
     },
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-your-bucket",
       "ViewerProtocolPolicy": "redirect-to-https",
       "Compress": true
     }
   }
   ```

### Amplify Console

1. Connect your repository to AWS Amplify
2. Configure build settings:
   - Build settings: `amplify.yml`

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install -g pnpm
           - pnpm install
       build:
         commands:
           - pnpm build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```

## Self-Hosting

### Simple HTTP Server

```bash
# After building
npm run build

# Serve with any static server
npx serve dist -l 3000

# Or using Python
python -m http.server 3000 --directory dist
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t wishlist-dock .
docker run -p 80:80 wishlist-dock
```

## CDN Hosting

### jsDelivr

1. **Publish to npm**
   ```bash
   npm publish
   ```

2. **Use CDN**
   ```html
   <script type="module" src="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js"></script>
   ```

### unpkg

```html
<script type="module" src="https://unpkg.com/@your-org/wishlist-dock/dist/wishlist-dock.es.js"></script>
```

### Self-Hosted CDN

1. **Upload to your CDN**
   ```bash
   # Upload dist/ contents to your CDN
   aws s3 sync dist/ s3://your-cdn-bucket
   ```

2. **Configure CloudFront**
   - Origin: Your S3 bucket
   - Cache behavior: Cache for 1 year
   - Compression: Enabled

## Web Component Deployment

### Automated Build Script

Create `scripts/build-webcomponent.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Read the built files
const esModule = fs.readFileSync('dist/wishlist-dock.es.js', 'utf8');
const css = fs.readFileSync('dist/wishlist-dock.css', 'utf8');

// Create Web Component wrapper
const webComponent = `
// Wishlist Dock Web Component
(function() {
  const styles = new CSSStyleSheet();
  styles.replaceSync(\`${css.replace(/`/g, '\\`')}\`);

  class WishlistDock extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.adoptedStyleSheets = [styles];
    }

    connectedCallback() {
      const theme = this.getAttribute('data-theme') || 'dark';
      // Component implementation here
    }
  }

  customElements.define('wishlist-dock', WishlistDock);
})();

${esModule}
`;

fs.writeFileSync('dist/wishlist-dock-webcomponent.js', webComponent);
```

### Update package.json

```json
{
  "scripts": {
    "build:webcomponent": "node scripts/build-webcomponent.js"
  }
}
```

## Environment Variables

### Create `.env.production`

```bash
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_OFFLINE=true

# Error Tracking
VITE_SENTRY_DSN=your-sentry-dsn
```

### Access in Code

```typescript
// API configuration
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Feature flags
const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
```

## Performance Optimization

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animation: ['framer-motion'],
          state: ['zustand'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
```

### Service Worker

```typescript
// public/sw.js
const CACHE_NAME = 'wishlist-dock-v1';
const ASSETS = [
  '/',
  '/assets/index.js',
  '/assets/index.css',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
```

### Compression

```javascript
// vercel.json
{
  "functions": {
    "dist/**/*.js": {
      "maxDuration": 1
    }
  },
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        },
        {
          "key": "Content-Encoding",
          "value": "gzip"
        }
      ]
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear cache
   rm -rf node_modules dist .vite
   npm install
   npm run build
   ```

2. **Deployment Stuck**
   ```bash
   # Cancel and redeploy
   vercel cancel
   vercel --prod
   ```

3. **Assets Not Loading**
   - Check base URL in `vite.config.ts`
   - Verify paths are absolute or use base href

4. **Web Component Issues**
   ```html
   <!-- Add type="module" -->
   <script type="module" src="widget.js"></script>
   ```

### Debug Mode

```bash
# Verbose build
npm run build -- --mode development

# Debug deployment
VERCEL_DEBUG=1 vercel --prod
```

### Performance Monitoring

```typescript
// Add performance monitoring
if (import.meta.env.PROD) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('Performance:', entry.name, entry.duration);
    }
  });
  observer.observe({ entryTypes: ['measure', 'navigation'] });
}
```

### Monitoring Tools

1. **Vercel Analytics**
   - Enabled by default
   - Real-time performance metrics

2. **Lighthouse CI**
   ```yaml
   # .lighthouserc.js
   module.exports = {
     ci: {
       collect: {
         url: ['https://yourdomain.com'],
       },
       assert: {
         assertions: {
           'categories:performance': ['warn', { minScore: 0.9 }],
         },
       },
     },
   };
   ```

---

This deployment guide should help you deploy the Wishlist Dock Widget to any platform of your choice. For additional help, refer to the platform-specific documentation or create an issue on GitHub.