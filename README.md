# Wishlist Dock Widget

A beautiful, embeddable wishlist widget that allows users to organize content items into collections. Built with React 18, TypeScript, and modern web technologies.

## Features

### Core Functionality
- **Dock Widget**: Floating button that expands into a panel with smooth animations
- **Stack Management**: Create, edit, and delete collections with auto-generated covers
- **Card Management**: Add, remove, and move cards between stacks
- **Swipe Mode**: Tinder-like card browsing experience

### Technical Features
- **Optimistic UI Updates**: Instant UI feedback with background API sync
- **Data Persistence**: LocalStorage support for offline functionality
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Theme Support**: Light and dark modes
- **Embeddable**: Can be added to any website via Web Component

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Zustand** - State management
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

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

### Building for Production

```bash
npm run build
```

## Embedding the Widget

### Method 1: React Component

```tsx
import { Dock } from './components';

function App() {
  return (
    <div>
      <YourContent />
      <Dock defaultTheme="dark" />
    </div>
  );
}
```

### Method 2: Web Component (Coming Soon)

```html
<!-- Include the widget script -->
<script src="https://your-cdn.com/wishlist-dock.js"></script>

<!-- Add the widget to your page -->
<wishlist-dock data-theme="dark"></wishlist-dock>
```

## Architecture

### Directory Structure

```
src/
├── api/              # Mock API service
├── components/       # React components
│   ├── Card/         # Card-related components
│   ├── Dock/         # Main dock widget
│   ├── Stack/        # Stack-related components
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── store/            # Zustand store
├── types/            # TypeScript types
└── utils/            # Utility functions
```

### State Management

The app uses Zustand for state management with the following key features:

- **Optimistic Updates**: UI updates immediately, syncs with API in background
- **Rollback on Error**: Reverts changes if API calls fail
- **Persistence**: Syncs with localStorage for offline support

### Component Architecture

- **Dock**: Main container with open/close animations
- **StacksList**: Displays all stacks with grid layout
- **StackView**: Shows cards within a selected stack
- **SwipeCards**: Tinder-like card swiping experience
- **CardItem**: Individual card with actions

## Design Decisions

### Why Zustand over Redux/Context?
- Minimal boilerplate
- Built-in devtools support
- Easy async actions without middleware
- Subscriptions for selective re-renders

### Why Framer Motion?
- Declarative animations
- Gesture support (drag, swipe)
- AnimatePresence for exit animations
- Great performance

### Why Tailwind CSS?
- Rapid prototyping
- Consistent design system
- Small bundle size with purging
- Easy responsive design

## Trade-offs

1. **Web Component vs iframe**: Chose to prepare Web Component wrapper for better integration, but full Shadow DOM support would need more testing

2. **Mock API vs Real Backend**: Used mock API with simulated delays to demonstrate optimistic UI patterns without backend complexity

3. **Swipe Library**: Implemented custom swipe logic with Framer Motion instead of external library for full control over animations

4. **Image Placeholders**: Using picsum.photos for demo images - production would use actual user-provided URLs

## Future Improvements

With more time, I would add:

1. **Testing**: Unit tests with Vitest, component tests with React Testing Library
2. **Drag & Drop**: Full drag-and-drop reordering with @dnd-kit
3. **Search/Filter**: Search within stacks and across all cards
4. **Keyboard Shortcuts**: Navigate with keyboard for accessibility
5. **Offline Support**: Service worker for full offline capability
6. **Code Splitting**: Lazy load swipe mode and modals
7. **i18n**: Internationalization support
8. **Analytics**: Track user interactions
9. **Share Functionality**: Share stacks with others
10. **Real Backend**: Connect to actual API with authentication

## License

MIT License

## Author

Built for Senior Frontend Developer Assessment
