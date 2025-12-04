import type { Stack, Card } from '../types';
import { delay } from '../utils';

// Simulated network delay range (ms)
const MIN_DELAY = 500;  // Min delay
const MAX_DELAY = 2500;  // Max delay

// Failure rate for testing optimistic UI rollback (0-1)
const FAILURE_RATE = 0.1;  // API failure rate

const getRandomDelay = () => Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;

const shouldFail = () => Math.random() < FAILURE_RATE;

class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

// Mock API Service
export const api = {
  // Stack operations
  async createStack(stack: Stack): Promise<Stack> {
    await delay(getRandomDelay());
    if (shouldFail()) {
      throw new ApiError('Failed to create stack. Please try again.');
    }
    console.log('[API] Created stack:', stack.name);
    return stack;
  },

  async updateStack(stack: Stack): Promise<Stack> {
    await delay(getRandomDelay());
    if (shouldFail()) {
      throw new ApiError('Failed to update stack. Please try again.');
    }
    console.log('[API] Updated stack:', stack.name);
    return stack;
  },

  async deleteStack(stackId: string): Promise<void> {
    await delay(getRandomDelay());
    if (shouldFail()) {
      throw new ApiError('Failed to delete stack. Please try again.');
    }
    console.log('[API] Deleted stack:', stackId);
  },

  async getStacks(): Promise<Stack[]> {
    await delay(getRandomDelay());
    console.log('[API] Fetched stacks');
    return [];
  },

  // Card operations
  async createCard(card: Card): Promise<Card> {
    await delay(getRandomDelay());
    if (shouldFail()) {
      throw new ApiError('Failed to create card. Please try again.');
    }
    console.log('[API] Created card:', card.name);
    return card;
  },

  async updateCard(card: Card): Promise<Card> {
    await delay(getRandomDelay());
    if (shouldFail()) {
      throw new ApiError('Failed to update card. Please try again.');
    }
    console.log('[API] Updated card:', card.name);
    return card;
  },

  async deleteCard(cardId: string): Promise<void> {
    await delay(getRandomDelay());
    if (shouldFail()) {
      throw new ApiError('Failed to delete card. Please try again.');
    }
    console.log('[API] Deleted card:', cardId);
  },

  async moveCard(cardId: string, toStackId: string): Promise<Card> {
    await delay(getRandomDelay());
    if (shouldFail()) {
      throw new ApiError('Failed to move card. Please try again.');
    }
    console.log('[API] Moved card:', cardId, 'to stack:', toStackId);
    return { id: cardId, stackId: toStackId } as Card;
  },

  async getCards(): Promise<Card[]> {
    await delay(getRandomDelay());
    console.log('[API] Fetched cards');
    return [];
  },

  // Batch operations
  async syncData(stacks: Stack[], cards: Card[]): Promise<{ stacks: Stack[]; cards: Card[] }> {
    await delay(getRandomDelay() * 1.5);
    if (shouldFail()) {
      throw new ApiError('Failed to sync data. Please try again.');
    }
    console.log('[API] Synced data:', stacks.length, 'stacks,', cards.length, 'cards');
    return { stacks, cards };
  },
};

export type { ApiError };
