import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Stack, Card, Theme } from '../types';
import { generateId, generateCover, saveToStorage, loadFromStorage } from '../utils';
import { api } from '../api';

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
  theme: Theme;
  isAddingCard: boolean;
  isCreatingStack: boolean;
  
  // Actions - Dock
  toggleDock: () => void;
  openDock: () => void;
  closeDock: () => void;
  setTheme: (theme: Theme) => void;
  
  // Actions - Stack
  createStack: (name: string) => Promise<void>;
  deleteStack: (stackId: string) => Promise<void>;
  updateStack: (stackId: string, updates: Partial<Stack>) => Promise<void>;
  setActiveStack: (stackId: string | null) => void;
  
  // Actions - Card
  createCard: (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  updateCard: (cardId: string, updates: Partial<Card>) => Promise<void>;
  moveCard: (cardId: string, toStackId: string) => Promise<void>;
  
  // Actions - Swipe Mode
  enterSwipeMode: () => void;
  exitSwipeMode: () => void;
  setSwipeIndex: (index: number) => void;
  nextCard: () => void;
  prevCard: () => void;
  
  // Actions - UI State
  setIsAddingCard: (value: boolean) => void;
  setIsCreatingStack: (value: boolean) => void;
  clearError: () => void;
  
  // Helpers
  getStackCards: (stackId: string) => Card[];
  getCardCount: (stackId: string) => number;
  
  // Initialization
  initializeFromStorage: () => void;
}

// Initial demo data
const createInitialData = (): { stacks: Stack[]; cards: Card[] } => {
  const now = Date.now();
  
  const stacks: Stack[] = [
    {
      id: generateId(),
      name: 'Reading List',
      ...generateCover(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Tech Articles',
      ...generateCover(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Shopping',
      ...generateCover(),
      createdAt: now,
      updatedAt: now,
    },
  ];
  
  const cards: Card[] = [
    {
      id: generateId(),
      name: 'The Future of AI',
      description: 'An in-depth look at where artificial intelligence is heading in the next decade.',
      cover: 'https://picsum.photos/seed/ai-future/400/300',
      stackId: stacks[1].id,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'React 19 Features',
      description: 'Exploring the new features coming in React 19.',
      cover: 'https://picsum.photos/seed/react19/400/300',
      stackId: stacks[1].id,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Design Systems Guide',
      description: 'Building scalable design systems for modern applications.',
      cover: 'https://picsum.photos/seed/design-sys/400/300',
      stackId: stacks[0].id,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Wireless Headphones',
      description: 'Premium noise-canceling headphones for work and travel.',
      cover: 'https://picsum.photos/seed/headphones/400/300',
      stackId: stacks[2].id,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Mechanical Keyboard',
      description: 'A high-quality mechanical keyboard with RGB lighting.',
      cover: 'https://picsum.photos/seed/keyboard/400/300',
      stackId: stacks[2].id,
      createdAt: now,
      updatedAt: now,
    },
  ];
  
  return { stacks, cards };
};

export const useWishlistStore = create<WishlistStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    stacks: [],
    cards: [],
    isOpen: false,
    activeStackId: null,
    isSwipeMode: false,
    currentSwipeIndex: 0,
    syncStatus: 'idle',
    errorMessage: null,
    theme: 'dark',
    isAddingCard: false,
    isCreatingStack: false,
    
    // Dock actions
    toggleDock: () => set(state => ({ isOpen: !state.isOpen })),
    openDock: () => set({ isOpen: true }),
    closeDock: () => set({ isOpen: false, activeStackId: null, isSwipeMode: false }),
    setTheme: (theme) => set({ theme }),
    
    // Stack actions with optimistic updates
    createStack: async (name) => {
      const { cover, coverType } = generateCover();
      const now = Date.now();
      const newStack: Stack = {
        id: generateId(),
        name,
        cover,
        coverType,
        createdAt: now,
        updatedAt: now,
      };
      
      // Optimistic update
      set(state => ({
        stacks: [...state.stacks, newStack],
        syncStatus: 'syncing',
        isCreatingStack: false,
      }));
      
      try {
        await api.createStack(newStack);
        set({ syncStatus: 'idle' });
        // Persist to storage
        const { stacks, cards } = get();
        saveToStorage({ stacks, cards });
      } catch (error) {
        // Rollback on failure
        set(state => ({
          stacks: state.stacks.filter(s => s.id !== newStack.id),
          syncStatus: 'error',
          errorMessage: error instanceof Error ? error.message : 'Failed to create stack',
        }));
      }
    },
    
    deleteStack: async (stackId) => {
      const { stacks, cards } = get();
      const stackToDelete = stacks.find(s => s.id === stackId);
      const cardsToDelete = cards.filter(c => c.stackId === stackId);
      
      // Optimistic update
      set(state => ({
        stacks: state.stacks.filter(s => s.id !== stackId),
        cards: state.cards.filter(c => c.stackId !== stackId),
        activeStackId: state.activeStackId === stackId ? null : state.activeStackId,
        syncStatus: 'syncing',
      }));
      
      try {
        await api.deleteStack(stackId);
        set({ syncStatus: 'idle' });
        // Persist to storage
        const { stacks: updatedStacks, cards: updatedCards } = get();
        saveToStorage({ stacks: updatedStacks, cards: updatedCards });
      } catch (error) {
        // Rollback on failure
        set(state => ({
          stacks: stackToDelete ? [...state.stacks, stackToDelete] : state.stacks,
          cards: [...state.cards, ...cardsToDelete],
          syncStatus: 'error',
          errorMessage: error instanceof Error ? error.message : 'Failed to delete stack',
        }));
      }
    },
    
    updateStack: async (stackId, updates) => {
      const { stacks } = get();
      const originalStack = stacks.find(s => s.id === stackId);
      
      if (!originalStack) return;
      
      const updatedStack: Stack = {
        ...originalStack,
        ...updates,
        updatedAt: Date.now(),
      };
      
      // Optimistic update
      set(state => ({
        stacks: state.stacks.map(s => s.id === stackId ? updatedStack : s),
        syncStatus: 'syncing',
      }));
      
      try {
        await api.updateStack(updatedStack);
        set({ syncStatus: 'idle' });
        const { stacks: updatedStacks, cards } = get();
        saveToStorage({ stacks: updatedStacks, cards });
      } catch (error) {
        // Rollback
        set(state => ({
          stacks: state.stacks.map(s => s.id === stackId ? originalStack : s),
          syncStatus: 'error',
          errorMessage: error instanceof Error ? error.message : 'Failed to update stack',
        }));
      }
    },
    
    setActiveStack: (stackId) => set({ 
      activeStackId: stackId, 
      isSwipeMode: false,
      currentSwipeIndex: 0,
    }),
    
    // Card actions with optimistic updates
    createCard: async (cardData) => {
      const now = Date.now();
      const newCard: Card = {
        ...cardData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      
      // Optimistic update
      set(state => ({
        cards: [...state.cards, newCard],
        syncStatus: 'syncing',
        isAddingCard: false,
      }));
      
      try {
        await api.createCard(newCard);
        set({ syncStatus: 'idle' });
        const { stacks, cards } = get();
        saveToStorage({ stacks, cards });
      } catch (error) {
        // Rollback
        set(state => ({
          cards: state.cards.filter(c => c.id !== newCard.id),
          syncStatus: 'error',
          errorMessage: error instanceof Error ? error.message : 'Failed to create card',
        }));
      }
    },
    
    deleteCard: async (cardId) => {
      const { cards } = get();
      const cardToDelete = cards.find(c => c.id === cardId);
      
      // Optimistic update
      set(state => ({
        cards: state.cards.filter(c => c.id !== cardId),
        syncStatus: 'syncing',
      }));
      
      try {
        await api.deleteCard(cardId);
        set({ syncStatus: 'idle' });
        const { stacks, cards: updatedCards } = get();
        saveToStorage({ stacks, cards: updatedCards });
      } catch (error) {
        // Rollback
        set(state => ({
          cards: cardToDelete ? [...state.cards, cardToDelete] : state.cards,
          syncStatus: 'error',
          errorMessage: error instanceof Error ? error.message : 'Failed to delete card',
        }));
      }
    },
    
    updateCard: async (cardId, updates) => {
      const { cards } = get();
      const originalCard = cards.find(c => c.id === cardId);
      
      if (!originalCard) return;
      
      const updatedCard: Card = {
        ...originalCard,
        ...updates,
        updatedAt: Date.now(),
      };
      
      // Optimistic update
      set(state => ({
        cards: state.cards.map(c => c.id === cardId ? updatedCard : c),
        syncStatus: 'syncing',
      }));
      
      try {
        await api.updateCard(updatedCard);
        set({ syncStatus: 'idle' });
        const { stacks, cards: updatedCards } = get();
        saveToStorage({ stacks, cards: updatedCards });
      } catch (error) {
        // Rollback
        set(state => ({
          cards: state.cards.map(c => c.id === cardId ? originalCard : c),
          syncStatus: 'error',
          errorMessage: error instanceof Error ? error.message : 'Failed to update card',
        }));
      }
    },
    
    moveCard: async (cardId, toStackId) => {
      const { cards } = get();
      const originalCard = cards.find(c => c.id === cardId);
      
      if (!originalCard) return;
      
      // Optimistic update
      set(state => ({
        cards: state.cards.map(c => 
          c.id === cardId ? { ...c, stackId: toStackId, updatedAt: Date.now() } : c
        ),
        syncStatus: 'syncing',
      }));
      
      try {
        await api.moveCard(cardId, toStackId);
        set({ syncStatus: 'idle' });
        const { stacks, cards: updatedCards } = get();
        saveToStorage({ stacks, cards: updatedCards });
      } catch (error) {
        // Rollback
        set(state => ({
          cards: state.cards.map(c => c.id === cardId ? originalCard : c),
          syncStatus: 'error',
          errorMessage: error instanceof Error ? error.message : 'Failed to move card',
        }));
      }
    },
    
    // Swipe mode actions
    enterSwipeMode: () => set({ isSwipeMode: true, currentSwipeIndex: 0 }),
    exitSwipeMode: () => set({ isSwipeMode: false, currentSwipeIndex: 0 }),
    setSwipeIndex: (index) => set({ currentSwipeIndex: index }),
    nextCard: () => {
      const { currentSwipeIndex, activeStackId, cards } = get();
      const stackCards = cards.filter(c => c.stackId === activeStackId);
      if (currentSwipeIndex < stackCards.length - 1) {
        set({ currentSwipeIndex: currentSwipeIndex + 1 });
      }
    },
    prevCard: () => {
      const { currentSwipeIndex } = get();
      if (currentSwipeIndex > 0) {
        set({ currentSwipeIndex: currentSwipeIndex - 1 });
      }
    },
    
    // UI State
    setIsAddingCard: (value) => set({ isAddingCard: value }),
    setIsCreatingStack: (value) => set({ isCreatingStack: value }),
    clearError: () => set({ errorMessage: null, syncStatus: 'idle' }),
    
    // Helpers
    getStackCards: (stackId) => {
      return get().cards.filter(c => c.stackId === stackId);
    },
    getCardCount: (stackId) => {
      return get().cards.filter(c => c.stackId === stackId).length;
    },
    
    // Initialize from storage or use demo data
    initializeFromStorage: () => {
      const stored = loadFromStorage();
      if (stored && stored.stacks.length > 0) {
        set({ stacks: stored.stacks, cards: stored.cards });
      } else {
        const { stacks, cards } = createInitialData();
        set({ stacks, cards });
        saveToStorage({ stacks, cards });
      }
    },
  }))
);

// Subscribe to changes and persist
useWishlistStore.subscribe(
  (state) => ({ stacks: state.stacks, cards: state.cards }),
  ({ stacks, cards }) => {
    if (stacks.length > 0 || cards.length > 0) {
      saveToStorage({ stacks, cards });
    }
  }
);
