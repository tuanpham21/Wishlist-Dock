# Architecture Documentation

This document provides a deep dive into the Wishlist Dock Widget's architecture, design decisions, and technical implementation details.

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [State Management](#state-management)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [Performance Optimizations](#performance-optimizations)
- [Security Considerations](#security-considerations)
- [Scalability](#scalability)

## High-Level Architecture

The Wishlist Dock Widget follows a modular, feature-based architecture that emphasizes separation of concerns and maintainability.

```
┌─────────────────────────────────────────────────────────┐
│                    Wishlist Dock Widget                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Web Comp  │  │ React Component │  │   Shadow DOM │  │
│  │   Wrapper   │  │    Core      │  │   Isolation  │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
│         │                 │                 │          │
│         │                 │                 │          │
│         │              CSS Injection         │          │
│         │                 │                 │          │
│  ┌──────▼──────┐  ┌──────▼─────┐  ┌────────▼─────┐  │
│  │ Custom      │  │ Zustand    │  │ CSS Fetcher  │  │
│  │ Element API │  │    Store     │  │ & Injector   │  │
│  └─────────────┘  └─────────────┘  └──────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Mock API   │  │ LocalStorage │  │   Framer    │   │
│  │   Service    │  │ Persistence  │  │   Motion    │   │
│  └──────────────┘  └─────────────┘  └─────────────┘   │
│                                                         │
│  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ Tailwind     │  │   Vite      │  │ TypeScript  │   │
│  │    CSS       │  │   Build     │  │   Types     │   │
│  └──────────────┘  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Shadow DOM Implementation

The widget uses Shadow DOM for complete style isolation, ensuring it doesn't conflict with host page styles. Here's how it works:

1. **Element Registration**: Custom element `<wishlist-dock>` is registered as `WishlistDockElement`
2. **Shadow DOM Creation**: On `connectedCallback`, a shadow root is created
3. **CSS Loading**: CSS is fetched asynchronously and injected into the shadow DOM
4. **React Rendering**: React app is rendered inside the shadow DOM with full style isolation

```typescript
// src/components/Dock/WishlistDockElement.tsx
class WishlistDockElement extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const mountPoint = document.createElement('div');

    // Asynchronously load and inject CSS
    this.loadCssAndMount(styleElement);
  }

  private async loadCssAndMount(styleElement: HTMLStyleElement) {
    // Fetch CSS and inject into Shadow DOM
    const response = await fetch('/wishlist-dock.css');
    styleElement.textContent = await response.text();

    // Mount React after CSS is loaded
    this.root = ReactDOM.createRoot(this.mountPoint);
    this.render();
  }
}
```

## State Management

### Zustand Store Implementation

The application uses Zustand for state management, chosen for its minimal boilerplate and excellent TypeScript support.

```typescript
// src/store/wishlistStore.ts
interface WishlistStore {
  // State
  stacks: Stack[];
  cards: Card[];
  isOpen: boolean;
  activeStackId: string | null;
  isSwipeMode: boolean;
  currentSwipeIndex: number;
  syncStatus: 'idle' | 'syncing' | 'error';
  errorMessage: string | null;
  theme: 'light' | 'dark';

  // Actions (60+ actions for complete CRUD operations)
  createStack: (name: string) => Promise<void>;
  updateStack: (id: string, updates: Partial<Stack>) => Promise<void>;
  deleteStack: (id: string) => Promise<void>;
  createCard: (card: CreateCardData) => Promise<void>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  moveCard: (cardId: string, targetStackId: string) => Promise<void>;
  // ... more actions
}
```

### Optimistic UI Pattern

All mutations follow a consistent optimistic update pattern:

1. **Immediate UI Update** - State updates instantly
2. **Background Sync** - API call happens asynchronously
3. **Error Handling** - Automatic rollback on failure
4. **Persistence** - Changes saved to localStorage

```typescript
const createStack: (name: string) => Promise<void> = async (name) => {
  const original = get().stacks;
  const newStack: Stack = {
    id: generateId(),
    name,
    cover: generateCover(),
    coverType: 'image',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // 1. Optimistic update
  set((state) => ({
    stacks: [...state.stacks, newStack],
    syncStatus: 'syncing' as const,
  }));

  try {
    // 2. API call
    await api.createStack(newStack);
    set({ syncStatus: 'idle' as const });

    // 3. Persistence
    saveToStorage({ stacks: get().stacks, cards: get().cards });
  } catch (error) {
    // 4. Rollback on error
    set({
      stacks: original,
      syncStatus: 'error' as const,
      errorMessage: error.message,
    });
  }
};
```

## Component Architecture

### Component Hierarchy

```
Dock (Root Component)
├── StacksList
│   ├── StackItem
│   ├── CreateStackForm
│   └── SearchInput
├── StackView
│   ├── CardItem
│   ├── AddCardForm
│   └── SwipeModeButton
├── SwipeCards
│   ├── CardItem (Swipeable)
│   └── SwipeControls
└── ErrorBanner
```

### Design Principles

1. **Single Responsibility** - Each component has one clear purpose
2. **Composition over Inheritance** - Components are composed from smaller pieces
3. **Props Interface** - Clear, typed props for all components
4. **No Side Effects** - Components are pure functions of props and state

### Stateless Components

Most UI components are stateless, receiving state and actions via props:

```typescript
interface StackItemProps {
  stack: Stack;
  cardCount: number;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isActive?: boolean;
}

const StackItem: React.FC<StackItemProps> = ({
  stack,
  cardCount,
  onClick,
  onEdit,
  onDelete,
  isActive = false,
}) => {
  // Pure UI rendering logic
  return (
    <motion.div
      className={`stack-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Component JSX */}
    </motion.div>
  );
};
```

## Data Flow

### Unidirectional Data Flow

The application follows React's unidirectional data flow pattern:

```
User Interaction → Component Action → Store Update → API Call → UI Re-render
```

### Data Model

```typescript
interface Stack {
  id: string;
  name: string;
  cover: string; // URL or CSS gradient
  coverType: 'image' | 'gradient' | 'solid';
  createdAt: number;
  updatedAt: number;
}

interface Card {
  id: string;
  name: string;
  description: string;
  cover: string; // Image URL
  stackId: string;
  createdAt: number;
  updatedAt: number;
}
```

### API Layer Abstraction

The mock API service simulates real backend behavior:

```typescript
// src/api/index.ts
export const api = {
  // Simulate network delays (200-800ms)
  delay: Math.random() * 600 + 200,

  // 5% failure rate for testing error handling
  shouldFail: Math.random() < 0.05,

  async createStack(stack: Stack): Promise<void> {
    await this.simulateDelay();
    if (this.shouldFail) {
      throw new ApiError('Failed to create stack');
    }
    // Simulate success
  },

  // ... other methods
};
```

## Design Patterns

### 1. Observer Pattern (Zustand Subscriptions)

```typescript
// Automatic localStorage persistence
useEffect(() => {
  const unsubscribe = useWishlistStore.subscribe(
    (state) => ({ stacks: state.stacks, cards: state.cards }),
    ({ stacks, cards }) => {
      saveToStorage({ stacks, cards });
    }
  );

  return unsubscribe;
}, []);
```

### 2. Custom Hooks Pattern

```typescript
// Reusable business logic
export const useStackCards = (stackId: string) => {
  const cards = useWishlistStore((state) => state.cards);
  const stackCards = cards.filter((card) => card.stackId === stackId);

  return {
    cards: stackCards,
    count: stackCards.length,
  };
};
```

### 3. Render Props Pattern (Optional)

For complex conditional rendering:

```typescript
const ConditionalRender: React.FC<{
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ condition, children, fallback = null }) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};
```

### 4. Compound Component Pattern

For related components that share state:

```typescript
const SwipeCards = () => {
  const { currentSwipeIndex, stackCards } = useSwipeState();

  return (
    <div className="swipe-container">
      {stackCards.map((card, index) => (
        <SwipeCard
          key={card.id}
          card={card}
          isActive={index === currentSwipeIndex}
          position={index - currentSwipeIndex}
        />
      ))}
    </div>
  );
};
```

## Performance Optimizations

### 1. Selective Subscriptions

Components only subscribe to the state they need:

```typescript
// Bad - subscribes to entire store
const data = useWishlistStore();

// Good - subscribes to specific state
const stacks = useWishlistStore((state) => state.stacks);
const createStack = useWishlistStore((state) => state.createStack);
```

### 2. Memoization

Expensive computations are memoized:

```typescript
const filteredStacks = useMemo(() => {
  return stacks.filter((stack) =>
    stack.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [stacks, searchQuery]);
```

### 3. Lazy Loading

Future optimization: lazy load heavy components:

```typescript
const SwipeCards = lazy(() => import('./SwipeCards'));

<Suspense fallback={<Loading />}>
  <SwipeCards />
</Suspense>
```

### 4. Debouncing

For search and other input-heavy operations:

```typescript
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    setSearchQuery(query);
  }, 300),
  []
);
```

## Security Considerations

### 1. Input Sanitization

```typescript
// Sanitize user input before displaying
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .substring(0, 1000); // Limit length
};
```

### 2. XSS Prevention

Using JSX automatically escapes content:

```tsx
// Safe - JSX escapes HTML
<div>{userInput}</div>

// Dangerous - avoid
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 3. Content Security Policy

Recommended CSP headers:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               img-src 'self' https://picsum.photos;
               style-src 'self' 'unsafe-inline';">
```

## Scalability

### 1. Modular Architecture

The component structure supports easy feature addition:

```
components/
├── Card/          # All card-related components
├── Stack/         # All stack-related components
├── Dock/          # Main dock components
└── ui/            # Reusable UI components
```

### 2. Plugin Architecture

Future extensibility through hooks:

```typescript
interface Plugin {
  name: string;
  initialize: () => void;
  components?: Record<string, ComponentType>;
  actions?: Record<string, Function>;
}

// Example plugin system
const usePluginSystem = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);

  const registerPlugin = (plugin: Plugin) => {
    setPlugins(prev => [...prev, plugin]);
  };

  return { plugins, registerPlugin };
};
```

### 3. Feature Flags

For gradual rollout of new features:

```typescript
const useFeatureFlag = (flag: string): boolean => {
  const flags = useWishlistStore((state) => state.featureFlags);
  return flags[flag] || false;
};

// Usage
const { isExperimentalFeatureEnabled } = useFeatureFlag('experimentalFeature');
```

### 4. Database Schema Considerations

For future backend integration:

```sql
-- Stacks table
CREATE TABLE stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  cover_url VARCHAR(500),
  cover_type VARCHAR(20) DEFAULT 'image',
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cards table
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_url VARCHAR(500),
  stack_id UUID REFERENCES stacks(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cards_stack_id ON cards(stack_id);
CREATE INDEX idx_stacks_user_id ON stacks(user_id);
```

## Testing Architecture

### Test Structure

```
src/
├── __tests__/           # Unit tests
│   ├── store/          # Store tests
│   └── utils/          # Utility tests
├── components/          # Component tests
│   └── *.test.tsx      # Co-located tests
└── test/               # Test utilities
    ├── setup.ts        # Test setup
    ├── utils.tsx       # Test utilities
    └── mocks/          # Mock data
```

### Test Strategy

1. **Unit Tests** - Store actions, utilities, hooks
2. **Component Tests** - User interactions, UI rendering
3. **Integration Tests** - Component workflows
4. **E2E Tests** - Complete user journeys (future)

---

This architecture ensures the Wishlist Dock Widget is maintainable, scalable, and follows best practices for modern React development.