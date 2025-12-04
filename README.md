# Wishlist Dock Widget

A beautiful, embeddable wishlist widget that allows users to organize content items into collections. Built with React 19, TypeScript, and modern web technologies.

[![Live Demo](https://img.shields.io/badge/Demo-View%20Online-blue)](https://wishlist-dock-ic90ffw56-tuanbmbsoftxenditcos-projects.vercel.app/)
[![Tests](https://img.shields.io/badge/Tests-25%20Passing-green)](https://github.com/tuanpham21/Wishlist-Dock/actions)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## ✨ Features

- 🎯 **Stack Management** - Create, edit, and delete collections with auto-generated covers
- 📝 **Card Management** - Add, edit, move, and delete cards between stacks
- 💕 **Swipe Mode** - Tinder-like card browsing with gesture controls
- 🔍 **Search & Filter** - Real-time search through your collections
- 🎨 **Theme Support** - Light and dark modes
- 🚀 **Optimistic UI** - Instant feedback with background sync
- 📦 **Embeddable** - Works anywhere with Web Component or React
- 📱 **Responsive** - Perfect on desktop and mobile
- 🧪 **Fully Tested** - 25 tests with comprehensive coverage

## 🚀 Quick Start

### Option 1: Web Component (Recommended)

```html
<!-- Load the widget CSS first -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.css" />

<!-- Load the widget module -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js"></script>

<!-- Use the widget -->
<wishlist-dock data-theme="dark"></wishlist-dock>
```

**Features:**
- ✅ **Shadow DOM Isolation** - Widget styles don't conflict with your page
- ✅ **Auto CSS Loading** - Automatically loads and injects CSS into Shadow DOM
- ✅ **Fallback Handling** - Gracefully handles CSS loading failures
- ✅ **Theme Support** - Switch between light and dark modes

### Option 2: React App

```bash
npm install @your-org/wishlist-dock
```

```tsx
import { Dock } from '@your-org/wishlist-dock';
import '@your-org/wishlist-dock/dist/wishlist-dock.css';

function App() {
  return <Dock defaultTheme="dark" />;
}
```

### Option 3: Clone and Run

```bash
git clone https://github.com/tuanpham21/Wishlist-Dock.git
cd Wishlist-Dock
pnpm install
pnpm dev

# Available commands
pnpm dev              # Start development server (port 3000)
pnpm preview          # Preview production build (port 4173)
pnpm preview:lib      # Build and preview library version
pnpm build            # Build for production
pnpm build:lib        # Build library version
```

## 📚 Documentation

For detailed information, check out our comprehensive documentation:

- **[📖 Documentation](./docs/README.md)** - Complete overview and getting started
- **[🏗️ Architecture](./docs/ARCHITECTURE.md)** - Deep dive into technical implementation
- **[🌗 Shadow DOM](./docs/SHADOW_DOM.md)** - Style isolation and CSS loading mechanism
- **[📡 API Reference](./docs/API.md)** - Complete API documentation
- **[🚀 Deployment](./docs/DEPLOYMENT.md)** - Deploy to Vercel, Netlify, AWS, or self-host
- **[🎯 Embedding Guide](./docs/EMBEDDING.md)** - How to embed on any website
- **[🤝 Contributing](./docs/CONTRIBUTING.md)** - Development setup and contribution guidelines

## 🛠️ Tech Stack

- **React 19.2.0** - Latest UI library
- **TypeScript 5.9** - Complete type safety
- **Zustand 5.0** - Lightweight state management
- **Framer Motion 12.23** - Declarative animations
- **Tailwind CSS 4.1** - Utility-first styling
- **Vite 7.2** - Lightning-fast builds
- **Vitest 4.0** - Fast unit testing

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run with UI
pnpm test:ui
```

## 📦 Build & Deploy

```bash
# Build for production
pnpm build

# Build library version
pnpm build:lib

# Build library for production
pnpm build:lib:prod

# Preview production build
pnpm preview

# Build and preview library version
pnpm preview:lib

# Deploy to Vercel
pnpm deploy
```

## 🎯 Live Demo

**[View Live Demo →](https://wishlist-dock-ic90ffw56-tuanbmbsoftxenditcos-projects.vercel.app/)**

See the widget in action with:
- Stack creation and management
- Card CRUD operations
- Swipe mode browsing
- Theme switching
- Search functionality
- Mobile responsiveness

## 📊 Project Stats

- **Components**: 12+ focused, modular components
- **Test Coverage**: 25 tests covering all functionality
- **Bundle Size**: ~115KB gzipped
- **Build Time**: ~3 seconds
- **Zero Dependencies**: Runtime has no external dependencies

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built for the Senior Frontend Developer Assessment. Demonstrates modern React patterns, TypeScript best practices, and production-ready architecture.

---

**Made with ❤️ using React, TypeScript, and modern web technologies**