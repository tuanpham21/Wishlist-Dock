# Wishlist Dock Widget - Documentation

Welcome to the Wishlist Dock Widget documentation. This guide covers everything you need to know about the embeddable wishlist component built with React 19, TypeScript, and modern web technologies.

## 📚 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Live Demo](#live-demo)

## Overview

The Wishlist Dock Widget is a production-ready, embeddable React component that allows users to organize content items into collections. It features a floating dock that expands into a full-featured panel with:

- Stack (collection) management with beautiful auto-generated covers
- Card operations (create, edit, move, delete)
- Tinder-like swipe mode for browsing
- Real-time search and filtering
- Theme support (light/dark)
- Optimistic UI updates with error handling
- Web Component support with Shadow DOM isolation

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/tuanpham21/Wishlist-Dock.git
cd Wishlist-Dock

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Preview production build
pnpm preview

# Build and preview library version
pnpm preview:lib
```

### Basic Usage

```tsx
import { Dock } from './src/components/Dock/Dock';

function App() {
  return (
    <div>
      <h1>My Website</h1>
      <Dock defaultTheme="dark" />
    </div>
  );
}
```

## Live Demo

**[View Live Demo](https://wishlist-dock-ic90ffw56-tuanbmbsoftxenditcos-projects.vercel.app/)**

## Documentation

### Development
- **[Architecture](./ARCHITECTURE.md)** - Deep dive into architecture, design decisions, and technical implementation
- **[Shadow DOM Implementation](./SHADOW_DOM.md)** - How the widget achieves style isolation and CSS loading
- **[API Reference](./API.md)** - Complete API documentation for components, hooks, and store
- **[Contributing Guide](./CONTRIBUTING.md)** - Development setup, coding standards, and contribution guidelines

### Deployment
- **[Deployment Guide](./DEPLOYMENT.md)** - How to deploy to Vercel, Netlify, or self-host
- **[Embedding Guide](./EMBEDDING.md)** - Detailed instructions for embedding in any website

## Key Features

- ✅ **Type-safe** - Full TypeScript implementation
- ✅ **Responsive** - Works seamlessly on desktop and mobile
- ✅ **Embeddable** - Web Component with Shadow DOM for zero CSS conflicts
- ✅ **Optimistic UI** - Instant feedback with background sync and rollback
- ✅ **Tested** - Comprehensive test suite with Vitest and React Testing Library
- ✅ **Accessible** - Keyboard navigation and ARIA support
- ✅ **Themeable** - Light and dark mode support

## Tech Stack

- **React 19.2.0** - Latest UI library
- **TypeScript 5.9** - Complete type safety
- **Zustand 5.0** - Lightweight state management
- **Framer Motion 12.23** - Declarative animations
- **Tailwind CSS 4.1** - Utility-first styling
- **Vite 7.2** - Fast build tool
- **Vitest 4.0** - Unit testing framework

## Project Structure

```
src/
├── components/       # React components
│   ├── Card/         # Card-related components
│   ├── Dock/         # Main dock widget
│   ├── Stack/        # Stack-related components
│   └── ui/           # Reusable UI components
├── store/            # Zustand state management
├── types/            # TypeScript definitions
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
├── api/              # Mock API service
└── test/             # Test utilities and setup
```

## License

MIT License - see [LICENSE](../LICENSE) for details.

## Support

For questions, issues, or contributions, please refer to the [Contributing Guide](./CONTRIBUTING.md).

---

Built with ❤️ for the Senior Frontend Developer Assessment