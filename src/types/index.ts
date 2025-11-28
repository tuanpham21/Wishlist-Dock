export interface Card {
  id: string;
  name: string;
  description?: string;
  cover: string;
  stackId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Stack {
  id: string;
  name: string;
  cover: string;
  coverType: 'image' | 'gradient' | 'color';
  createdAt: number;
  updatedAt: number;
}

export interface WishlistState {
  stacks: Stack[];
  cards: Card[];
  isOpen: boolean;
  activeStackId: string | null;
  isSwipeMode: boolean;
  currentSwipeIndex: number;
  syncStatus: 'idle' | 'syncing' | 'error';
  pendingOperations: PendingOperation[];
}

export interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'stack' | 'card';
  data: Partial<Stack | Card>;
  timestamp: number;
}

export type Theme = 'light' | 'dark';

export interface DockConfig {
  theme: Theme;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}
