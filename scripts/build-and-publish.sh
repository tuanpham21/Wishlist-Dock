#!/bin/bash

# Build and publish script for NPM package
set -e

echo "🔨 Building Wishlist Dock for NPM publishing..."

# Clean previous builds
rm -rf dist/
echo "✅ Cleaned previous build"

# Build the library
BUILD_TARGET=library NODE_ENV=production npm run build
echo "✅ Built library"

# Generate TypeScript declarations
echo "📝 Generating type declarations..."
npx tsc --declaration --emitDeclarationOnly --outDir dist --moduleResolution node
echo "✅ Generated type declarations"

# Copy package.json for publishing
cp package.lib.json dist/package.json
echo "✅ Copied package configuration"

# Copy README
cp README.md dist/ 2>/dev/null || echo "⚠️  README.md not found, creating basic one..."
if [ ! -f dist/README.md ]; then
  cat > dist/README.md << 'EOF'
# Wishlist Dock Widget

An embeddable React widget for organizing content into collections.

## Quick Start

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js"></script>
<wishlist-dock data-theme="dark"></wishlist-dock>
```

## Documentation

See full documentation at https://github.com/your-org/wishlist-dock
EOF
fi

# Verify the build
echo "🔍 Verifying build..."
ls -la dist/

# Check if we're in the right directory for publishing
cd dist/

echo "📦 Package ready for publishing!"
echo ""
echo "To publish to NPM:"
echo "  cd dist"
echo "  npm publish"
echo ""
echo "To test locally first:"
echo "  cd dist"
echo "  npm pack"
echo "  npm install ./wishlist-dock-1.0.0.tgz"