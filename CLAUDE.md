# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wishlist Dock is an embeddable React widget that allows users to organize content items into collections. It features a floating dock button that expands into a panel with stack (collection) management, card browsing, and a Tinder-like swipe mode.

## Development Commands

```bash
# Start development server (Vite)
npm run dev

# Build for production (TypeScript compilation + Vite build)
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

### State Management with Zustand

The app uses Zustand (`src/store/wishlistStore.ts`) with **optimistic updates** as the core pattern:

1. **Immediate UI Update**: UI updates instantly when user performs action
2. **Background API Sync**: Mock API call happens asynchronously (200-800ms delay)
3. **Rollback on Error**: If API fails (5% rate), state reverts to previous version
4. **Persistence**: All changes sync to localStorage automatically via subscription

This pattern means all store actions (`createStack`, `deleteCard`, `moveCard`, etc.) follow this flow:
- Optimistically update state with new data
- Set `syncStatus: 'syncing'`
- Call mock API
- On success: persist to localStorage
- On failure: rollback state and set error message

### Mock API Layer

`src/api/index.ts` simulates network behavior:
- Random delays (200-800ms) for realistic async feel
- 5% failure rate to test rollback behavior
- Console logs all operations for debugging
- In production, replace with real API endpoints

### Data Model

**Stack** (collection/folder):
- Has auto-generated cover (image URL, gradient, or solid color)
- Contains multiple cards

**Card** (saved item):
- Belongs to one stack
- Has image cover, name, description
- Can be moved between stacks

### Component Architecture

```
Dock (main widget)
├── StacksList (grid view of all stacks)
│   ├── StackItem (individual stack card)
│   └── CreateStackForm (modal)
├── StackView (cards within selected stack)
│   ├── CardItem (individual card)
│   └── AddCardForm (modal)
└── SwipeCards (Tinder-like browsing)
    └── CardItem (swipeable card)
```

### Key Features

- **Dock Widget**: Floating button with AnimatePresence animations
- **Stack Management**: Create/edit/delete collections
- **Card Operations**: Add/remove/move cards between stacks
- **Swipe Mode**: Browse cards with Framer Motion drag gestures
- **Theme Support**: Light/dark mode (currently dark by default)
- **Data Persistence**: localStorage for offline functionality

## Tech Stack

- **React 19** with TypeScript
- **Zustand** for state management (with `subscribeWithSelector` middleware)
- **Framer Motion** for animations and gestures
- **Tailwind CSS v4** for styling (via `@tailwindcss/vite` plugin)
- **Vite** as build tool
- **@dnd-kit** for drag-and-drop (installed but not fully implemented yet)

## Important Patterns

### Adding New Store Actions

All store mutations should follow the optimistic update pattern in `wishlistStore.ts`:

```typescript
actionName: async (params) => {
  const original = get().data;

  // 1. Optimistic update
  set(state => ({
    data: newData,
    syncStatus: 'syncing'
  }));

  try {
    // 2. API call
    await api.action(newData);
    set({ syncStatus: 'idle' });

    // 3. Persist
    const { stacks, cards } = get();
    saveToStorage({ stacks, cards });
  } catch (error) {
    // 4. Rollback on error
    set({
      data: original,
      syncStatus: 'error',
      errorMessage: error.message
    });
  }
}
```

### Component Styling

- Use Tailwind CSS utility classes
- Follow the dark theme color palette (slate/purple/violet gradients)
- Use `backdrop-blur` and transparency for glassmorphism effects
- Framer Motion's `motion.*` components for animations

## Image URLs

Demo images use picsum.photos with seeds for consistency:
```typescript
cover: 'https://picsum.photos/seed/unique-key/400/300'
```

For stack covers, `generateCover()` in `src/utils/index.ts` randomly creates:
- Image URLs from picsum.photos
- CSS gradients
- Solid colors

## Future Embeddability

The widget is designed to be embeddable via Web Component (see README "Method 2"). Current usage is as a React component:

```tsx
<Dock defaultTheme="dark" />
```

The Web Component wrapper would register `<wishlist-dock>` custom element but is not yet implemented.
