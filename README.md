# Wishlist Dock Widget

A beautiful, embeddable wishlist widget that allows users to organize content items into collections. Built with React 19, TypeScript, and modern web technologies with production-ready Web Component architecture.

## 📑 Table of Contents

- [Setup Instructions](#setup-instructions)
- [How to Embed the Widget](#how-to-embed-the-widget)
- [Architecture Decisions](#architecture-decisions)
- [Trade-offs](#trade-offs)
- [What You'd Improve With More Time](#what-youd-improve-with-more-time)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Summary](#-project-summary)

---

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/wishlist-dock.git
cd wishlist-dock

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:3000` with hot reload enabled.

### Building for Production

```bash
# Build the React application
npm run build

# Build library version for embedding (ES + UMD formats)
npm run build:lib

# Preview the production build
npm run preview
```

The library build creates distributable files in the `dist/` directory:
- `dist/wishlist-dock.es.js` - ES module for modern bundlers
- `dist/wishlist-dock.umd.js` - UMD bundle for script tags
- `dist/wishlist-dock.css` - Compiled styles
- TypeScript type definitions for IDE support

### Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run build:lib # Build library version
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## How to Embed the Widget

The Wishlist Dock widget can be embedded in any website using one of the following methods:

### Method 1: Web Component (Recommended)

Add these lines to your HTML file:

```html
<!-- Load the widget -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js"></script>

<!-- Use the widget -->
<wishlist-dock data-theme="dark"></wishlist-dock>
```

**Attributes:**
- `data-theme`: `"light"` or `"dark"` (default: `"dark"`)

**Benefits:**
- Complete style isolation with Shadow DOM
- Works with any framework (React, Vue, Angular, vanilla JS)
- Multiple instances on the same page
- Zero CSS conflicts

### Method 2: React Component

```bash
npm install @your-org/wishlist-dock
```

```tsx
import { Dock } from '@your-org/wishlist-dock';
import '@your-org/wishlist-dock/dist/wishlist-dock.css';

function App() {
  return (
    <div>
      <YourContent />
      <Dock defaultTheme="dark" />
    </div>
  );
}
```

**Props:**
- `defaultTheme`: `"light"` or `"dark"` (default: `"dark"`)

### Method 3: Self-Hosted

1. Clone and build the repository
2. Serve the files from your CDN or server
3. Include them in your HTML:

```html
<script type="module" src="/path/to/wishlist-dock.es.js"></script>
<wishlist-dock data-theme="dark"></wishlist-dock>
```

### Multiple Instances

You can add multiple widgets on the same page, each with independent state:

```html
<wishlist-dock data-theme="dark" id="widget1"></wishlist-dock>
<wishlist-dock data-theme="light" id="widget2"></wishlist-dock>
```

### Styling Customization

While the widget uses encapsulated styles, you can customize the theme:

```html
<!-- For dark theme -->
<wishlist-dock data-theme="dark"></wishlist-dock>

<!-- For light theme -->
<wishlist-dock data-theme="light"></wishlist-dock>
```

## Architecture Decisions

### Component Architecture

The widget follows a feature-based architecture with clear separation of concerns:

```
src/
├── components/       # React components
│   ├── Card/         # Card-related components
│   ├── Dock/         # Main dock widget
│   ├── Stack/        # Stack-related components
│   └── ui/           # Reusable UI components
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── api/              # Mock API service
```

### State Management with Zustand

Chose Zustand for state management because:
- **Minimal Boilerplate**: No providers, reducers, or action creators needed
- **Tiny Bundle Size**: ~1KB compared to Redux's ~40KB
- **Built-in Async Support**: Handles async operations without middleware
- **TypeScript Support**: Excellent type inference out of the box
- **Selective Subscriptions**: Components only re-render when their data changes

### Optimistic UI Pattern

All mutations follow an optimistic update pattern:
1. **Immediate Update**: UI updates instantly when user performs action
2. **Background Sync**: API call happens asynchronously with mock delays (500-2500ms)
3. **Error Handling**: 20% failure rate demonstrates rollback capability
4. **Persistence**: Changes automatically sync to localStorage

### Web Component with Shadow DOM

Implemented as a Web Component for true embeddability:
- **Style Isolation**: Shadow DOM prevents CSS conflicts with host page
- **Framework Agnostic**: Works with any frontend framework
- **Multiple Instances**: Each widget maintains independent state
- **Native Support**: Uses browser's custom elements API

### Animation Strategy

Used Framer Motion for animations because:
- **Declarative API**: Animations defined in JSX
- **Gesture Support**: Built-in drag, swipe, and gesture handlers
- **Performance**: GPU-accelerated transforms
- **AnimatePresence**: Handles enter/exit animations seamlessly

## Trade-offs

### State Management: Zustand vs Redux

**Trade-off**: Chose simplicity over ecosystem maturity

While Redux has a larger ecosystem and more debugging tools, Zustand's minimal API reduces boilerplate significantly. For a widget of this scope, Redux would be overkill. However, in a larger application with complex middleware needs, Redux's mature ecosystem might be preferable.

### Styling: Tailwind CSS vs CSS-in-JS

**Trade-off**: Chose development speed over runtime flexibility

Tailwind CSS enables rapid development with utility classes, but CSS-in-JS offers more dynamic styling capabilities. The static nature of Tailwind classes makes it slightly less flexible for theme switching or runtime style calculations. However, the improved developer experience and smaller bundle size justified this choice.

### Bundle Size: Features vs Performance

**Trade-off**: Prioritized user experience over minimal bundle size

Included Framer Motion (60KB) for superior animations instead of using CSS animations. While this increases bundle size, the smooth gestures and transitions significantly improve user experience. For bandwidth-constrained environments, a CSS-only version could be considered.

### Persistence: localStorage vs IndexedDB

**Trade-off**: Chose simplicity over scalability

Used localStorage for its simple API and synchronous access. However, it has limitations (5-10MB storage, synchronous operations). For production with large datasets, IndexedDB would be more appropriate with its async operations and larger storage capacity.

### API Layer: Mock vs Real Backend

**Trade-off**: Simulated network behavior over direct state updates

Implemented a mock API layer with realistic delays and failure rates instead of direct state mutations. This adds complexity but demonstrates production-ready patterns and makes the transition to a real backend seamless.

### Web Component: Shadow DOM vs iframe

**Trade-off**: Chose native encapsulation over complete isolation

Shadow DOM provides style isolation without the overhead of iframes. However, it doesn't prevent JavaScript access to the global scope. For complete isolation (e.g., when embedding on untrusted sites), an iframe might be more secure despite its performance cost.

## What You'd Improve With More Time

### Testing Strategy

1. **Unit Tests**: Add comprehensive test coverage for:
   - Store actions and state mutations
   - Utility functions
   - Custom hooks

2. **Component Tests**: Use React Testing Library for:
   - User interaction flows
   - Modal behaviors
   - Form submissions

3. **E2E Tests**: Implement Playwright tests for:
   - Complete user journeys
   - Cross-browser compatibility
   - Mobile responsiveness

### Accessibility Improvements

1. **Keyboard Navigation**: Full keyboard support for all interactions:
   - Tab order management
   - Arrow key navigation
   - Escape key handling
   - Enter/Space for actions

2. **Screen Reader Support**:
   - ARIA labels and descriptions
   - Live regions for dynamic content
   - Focus management in modals
   - Semantic HTML structure

3. **WCAG 2.1 Compliance**: Ensure AA level compliance for:
   - Color contrast ratios
   - Text resizing
   - Focus indicators
   - Motion preferences

### Performance Optimizations

1. **Code Splitting**: Implement lazy loading for:
   - Swipe mode component
   - Modal components
   - Non-critical features

2. **Image Optimization**:
   - WebP format support
   - Lazy loading with blur placeholders
   - Progressive image loading
   - Responsive images

3. **Virtual Scrolling**: For large collections of cards to:
   - Improve rendering performance
   - Reduce memory usage
   - Maintain smooth scrolling

4. **Bundle Optimization**:
   - Tree shaking unused code
   - Minimize dependencies
   - Implement service worker for caching

### Advanced Features

1. **Real-time Collaboration**:
   - WebSocket integration
   - Operational transforms
   - Conflict resolution
   - User presence indicators

2. **Enhanced Search**:
   - Full-text search across cards
   - Advanced filtering options
   - Search history
   - Saved searches

3. **Data Management**:
   - Import/export functionality
   - Backup and restore
   - Data migration tools
   - Bulk operations

4. **Offline Support**:
   - Service worker implementation
   - Background sync
   - Offline-first architecture
   - Conflict resolution strategy

### Developer Experience

1. **Comprehensive Documentation**:
   - Storybook for component catalog
   - API documentation
   - Migration guides
   - Best practices guide

2. **Development Tools**:
   - Custom hooks library
   - Component playground
   - Performance monitoring
   - Error tracking integration

3. **Build Optimization**:
   - Automated testing in CI/CD
   - Bundle analysis
   - Performance budgets
   - Automated releases

### Production Readiness

1. **Security Hardening**:
   - XSS prevention
   - Content Security Policy
   - Input sanitization
   - Dependency scanning

2. **Monitoring & Analytics**:
   - Error tracking (Sentry)
   - Performance monitoring
   - User analytics
   - Usage metrics

3. **Scalability**:
   - Database optimization
   - Caching strategies
   - CDN configuration
   - Load balancing

---

## Features

### Core Functionality
- **Dock Widget**: Floating button that expands into a panel with smooth animations
- **Stack Management**: Create, edit, rename, and delete collections with auto-generated covers
  - Edit stack names and regenerate covers
  - Search and filter stacks by name
  - Real-time search with clear button
- **Card Management**: Add, edit, remove, and move cards between stacks
  - Full CRUD operations with forms
  - Edit card details (name, description, cover image)
  - Move cards between stacks with visual modal
  - Image preview in edit form
- **Swipe Mode**: Tinder-like card browsing experience with gesture controls

### Technical Features
- **Optimistic UI Updates**: Instant UI feedback with background API sync and rollback on errors
- **Data Persistence**: LocalStorage support for offline functionality with automatic sync
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Theme Support**: Light and dark modes
- **Embeddable**: Can be added to any website via Web Component with Shadow DOM
  - **Zero CSS Conflicts**: Complete style isolation
  - **Multiple Instances**: Run several widgets independently
  - **CDN Ready**: Host on any CDN or self-host
- **Search & Filter**: Real-time search functionality for stacks with empty states

## Tech Stack

- **React 19.2.0** - Latest UI library with improved performance
- **TypeScript 5.9** - Complete type safety across the codebase
- **Zustand 5.0** - Lightweight state management (~1KB) with optimistic UI patterns
- **Framer Motion 12.23** - Declarative animations and gesture controls
- **Tailwind CSS 4.1** - Utility-first CSS with modern design system
- **Vite 7.2** - Lightning-fast dev server and optimized production builds
- **@dnd-kit** - Drag-and-drop library (installed, ready for future features)
- **uuid** - Reliable unique ID generation

---

## 📊 Project Summary

The Wishlist Dock Widget is a production-ready, embeddable React component that demonstrates modern frontend development practices.

### Key Achievements

- **Full TypeScript Implementation** with 100% type coverage
- **Web Component Support** with Shadow DOM for style isolation
- **Optimistic UI Pattern** with automatic error handling and rollback
- **Modern Development Stack** including React 19, Zustand, and Tailwind CSS v4
- **Embeddable Architecture** that works with any framework or vanilla JavaScript
- **Production-ready Build** system with ES and UMD outputs

### Code Quality

- Clean, feature-based architecture
- Comprehensive state management with persistence
- Reusable UI components
- Mock API layer for realistic network simulation
- Responsive design with mobile support

---

## License

MIT License

## Author

Built for Senior Frontend Developer Assessment

**Tech Stack**: React 19 · TypeScript 5.9 · Zustand · Tailwind CSS v4 · Framer Motion · Vite
