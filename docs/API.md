# API Reference

This document provides a comprehensive API reference for the Wishlist Dock Widget, including store actions, component props, and utility functions.

## Table of Contents

- [Store API](#store-api)
- [Component API](#component-api)
- [Hooks API](#hooks-api)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)
- [Mock API](#mock-api)

## Store API

### Zustand Store

The Wishlist Store manages all application state using Zustand.

```typescript
import { useWishlistStore } from '../store/wishlistStore';
```

#### State

| Property | Type | Description |
|----------|------|-------------|
| `stacks` | `Stack[]` | Array of all stacks |
| `cards` | `Card[]` | Array of all cards |
| `isOpen` | `boolean` | Whether the dock is open |
| `activeStackId` | `string \| null` | Currently selected stack ID |
| `isSwipeMode` | `boolean` | Whether swipe mode is active |
| `currentSwipeIndex` | `number` | Current card index in swipe mode |
| `syncStatus` | `'idle' \| 'syncing' \| 'error'` | Sync status with backend |
| `errorMessage` | `string \| null` | Error message to display |
| `theme` | `'light' \| 'dark'` | Current theme |
| `isAddingCard` | `boolean` | Whether add card form is open |
| `isCreatingStack` | `boolean` | Whether create stack form is open |

#### Actions

##### Dock Actions

```typescript
// Toggle dock open/closed
toggleDock: () => void

// Open dock
openDock: () => void

// Close dock and reset state
closeDock: () => void

// Set theme
setTheme: (theme: 'light' | 'dark') => void
```

##### Stack Actions

```typescript
// Create a new stack
createStack: (name: string) => Promise<void>

// Update an existing stack
updateStack: (id: string, updates: Partial<Stack>) => Promise<void>

// Delete a stack
deleteStack: (id: string) => Promise<void>

// Generate new cover for stack
regenerateStackCover: (id: string) => Promise<void>
```

##### Card Actions

```typescript
// Create a new card
createCard: (cardData: CreateCardData) => Promise<void>

// Update an existing card
updateCard: (id: string, updates: Partial<Card>) => Promise<void>

// Delete a card
deleteCard: (id: string) => Promise<void>

// Move card to another stack
moveCard: (cardId: string, targetStackId: string) => Promise<void>
```

##### Swipe Mode Actions

```typescript
// Enter swipe mode for a stack
enterSwipeMode: (stackId: string) => void

// Exit swipe mode
exitSwipeMode: () => void

// Navigate to next card
nextCard: () => void

// Navigate to previous card
prevCard: () => void

// Set current swipe index
setSwipeIndex: (index: number) => void

// Swipe card (left = skip, right = save)
swipeCard: (direction: 'left' | 'right') => void
```

##### UI State Actions

```typescript
// Show add card form
showAddCardForm: (stackId: string) => void

// Hide add card form
hideAddCardForm: () => void

// Show create stack form
showCreateStackForm: () => void

// Hide create stack form
hideCreateStackForm: () => void
```

##### Error Handling

```typescript
// Clear error message
clearError: () => void
```

##### Helper Functions

```typescript
// Get cards for a specific stack
getStackCards: (stackId: string) => Card[]

// Get card count for a stack
getCardCount: (stackId: string) => number

// Get active stack
getActiveStack: () => Stack | undefined

// Get swipe cards
getSwipeCards: () => Card[]
```

#### Usage Examples

```typescript
// Using hooks
function MyComponent() {
  const stacks = useWishlistStore((state) => state.stacks);
  const createStack = useWishlistStore((state) => state.createStack);
  const isOpen = useWishlistStore((state) => state.isOpen);

  const handleCreateStack = async (name: string) => {
    await createStack(name);
  };

  return (
    <div>
      <button onClick={handleCreateStack}>Create Stack</button>
      {isOpen && <p>Dock is open</p>}
    </div>
  );
}

// Using store directly
const store = useWishlistStore.getState();
store.createStack('My New Stack');

// Subscribing to changes
const unsubscribe = useWishlistStore.subscribe(
  (state) => state.stacks,
  (stacks) => console.log('Stacks updated:', stacks)
);
```

## Component API

### Dock Component

Main widget component that renders the floating dock button and expanded panel.

```typescript
interface DockProps {
  defaultTheme?: 'light' | 'dark';
  className?: string;
}

<Dock defaultTheme="dark" />
```

### StacksList Component

Renders a grid view of all stacks.

```typescript
interface StacksListProps {
  stacks: Stack[];
  onStackClick: (stackId: string) => void;
  onCreateStack: () => void;
  onEditStack: (stackId: string) => void;
  onDeleteStack: (stackId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}
```

### StackItem Component

Individual stack card in the grid.

```typescript
interface StackItemProps {
  stack: Stack;
  cardCount: number;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isActive?: boolean;
  showActions?: boolean;
}
```

### StackView Component

Displays cards within a selected stack.

```typescript
interface StackViewProps {
  stack: Stack;
  cards: Card[];
  onBack: () => void;
  onAddCard: () => void;
  onEditCard: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
  onMoveCard: (cardId: string) => void;
  onEnterSwipeMode: () => void;
}
```

### CardItem Component

Individual card component.

```typescript
interface CardItemProps {
  card: Card;
  onEdit?: () => void;
  onDelete?: () => void;
  onMove?: () => void;
  showActions?: boolean;
  variant?: 'grid' | 'list' | 'swipe';
}
```

### SwipeCards Component

Tinder-like card swiping interface.

```typescript
interface SwipeCardsProps {
  cards: Card[];
  currentIndex: number;
  onSwipe: (direction: 'left' | 'right') => void;
  onIndexChange: (index: number) => void;
  onExit: () => void;
}
```

### Form Components

#### CreateStackForm

```typescript
interface CreateStackFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

<CreateStackForm
  isOpen={isCreatingStack}
  onClose={hideCreateStackForm}
  onSubmit={async (name) => {
    await createStack(name);
    hideCreateStackForm();
  }}
/>
```

#### AddCardForm

```typescript
interface AddCardFormProps {
  isOpen: boolean;
  stackId: string;
  onClose: () => void;
  onSubmit: (data: CreateCardData) => Promise<void>;
}

interface CreateCardData {
  name: string;
  description: string;
  cover: string;
  stackId: string;
}
```

#### EditCardForm

```typescript
interface EditCardFormProps {
  isOpen: boolean;
  card: Card;
  onClose: () => void;
  onSubmit: (data: Partial<Card>) => Promise<void>;
}
```

#### EditStackForm

```typescript
interface EditStackFormProps {
  isOpen: boolean;
  stack: Stack;
  onClose: () => void;
  onSubmit: (data: Partial<Stack>) => Promise<void>;
}
```

### UI Components

#### Button

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
```

#### Input

```typescript
interface InputProps {
  type?: 'text' | 'email' | 'url' | 'textarea';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}
```

#### Modal

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

#### Loading

```typescript
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullscreen?: boolean;
}
```

## Hooks API

### useStackCards

Get cards and count for a specific stack.

```typescript
function useStackCards(stackId: string): {
  cards: Card[];
  count: number;
}

const { cards, count } = useStackCards(stackId);
```

### useKeyboardShortcut

Execute callback on keyboard shortcut.

```typescript
interface KeyboardShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: () => void,
  enabled?: boolean
): void

// Example: Cmd/Ctrl + K to toggle dock
useKeyboardShortcut(
  { key: 'k', ctrlKey: true, metaKey: true },
  toggleDock,
  true
);
```

### useFocusTrap

Trap focus within a container (useful for modals).

```typescript
function useFocusTrap(isActive?: boolean): {
  containerRef: RefObject<HTMLDivElement>;
}

// In modal component
const { containerRef } = useFocusTrap(isOpen);
```

## Utility Functions

### generateId

Generate a unique ID using UUID.

```typescript
function generateId(): string

const id = generateId(); // 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
```

### generateCover

Generate a random cover (image URL, gradient, or solid color).

```typescript
function generateCover(): {
  url: string;
  type: 'image' | 'gradient' | 'solid';
}

const { url, type } = generateCover();
```

### saveToStorage / loadFromStorage

Persist and load data from localStorage.

```typescript
function saveToStorage(data: { stacks: Stack[]; cards: Card[] }): void
function loadFromStorage(): { stacks: Stack[]; cards: Card[] } | null
```

### validateForm

Validate form data with rules.

```typescript
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean | string;
}

function validateForm(
  data: Record<string, string>,
  rules: Record<string, ValidationRule>
): {
  isValid: boolean;
  errors: Record<string, string>;
}
```

## Type Definitions

### Core Types

```typescript
interface Stack {
  id: string;
  name: string;
  cover: string;
  coverType: 'image' | 'gradient' | 'solid';
  createdAt: number;
  updatedAt: number;
}

interface Card {
  id: string;
  name: string;
  description: string;
  cover: string;
  stackId: string;
  createdAt: number;
  updatedAt: number;
}

interface CreateCardData {
  name: string;
  description: string;
  cover: string;
  stackId: string;
}
```

### Store Types

```typescript
type SyncStatus = 'idle' | 'syncing' | 'error';
type Theme = 'light' | 'dark';

interface WishlistState {
  stacks: Stack[];
  cards: Card[];
  isOpen: boolean;
  activeStackId: string | null;
  isSwipeMode: boolean;
  currentSwipeIndex: number;
  syncStatus: SyncStatus;
  errorMessage: string | null;
  theme: Theme;
  isAddingCard: boolean;
  isCreatingStack: boolean;
}

type WishlistActions = {
  // All store actions...
};

type WishlistStore = WishlistState & WishlistActions;
```

## Mock API

The mock API simulates real backend behavior for development and testing.

### Configuration

```typescript
// src/api/index.ts
export const api = {
  // Delay range (ms)
  delay: 200 + Math.random() * 600,

  // Failure rate (0-1)
  failureRate: 0.05,

  // Methods
  createStack: (stack: Stack) => Promise<void>,
  updateStack: (stack: Stack) => Promise<void>,
  deleteStack: (id: string) => Promise<void>,
  createCard: (card: Card) => Promise<void>,
  updateCard: (card: Card) => Promise<void>,
  deleteCard: (id: string) => Promise<void>,
  moveCard: (cardId: string, stackId: string) => Promise<void>,
};
```

### Error Handling

```typescript
class ApiError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Usage
try {
  await api.createStack(stack);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message, error.code);
  }
}
```

## Migration Guide

### From v1 to v2

1. **Store Structure**: Moved from Context API to Zustand
2. **Component Props**: Simplified and standardized prop interfaces
3. **Type Safety**: Added comprehensive TypeScript types

### Future Backend Integration

Replace mock API with real backend:

```typescript
// src/api/real.ts
export const api = {
  async createStack(stack: Stack): Promise<void> {
    const response = await fetch('/api/stacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stack),
    });

    if (!response.ok) {
      throw new ApiError('Failed to create stack', 'CREATE_FAILED');
    }
  },

  // ... other methods
};
```

---

This API reference provides all the information needed to integrate, extend, or customize the Wishlist Dock Widget.