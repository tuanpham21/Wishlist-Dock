import { v4 as uuidv4 } from 'uuid';

// Elegant gradient palettes - curated for a refined aesthetic
const GRADIENT_PALETTES = [
  ['#667eea', '#764ba2'], // Purple dream
  ['#f093fb', '#f5576c'], // Pink sunset
  ['#4facfe', '#00f2fe'], // Ocean breeze
  ['#43e97b', '#38f9d7'], // Mint fresh
  ['#fa709a', '#fee140'], // Warm glow
  ['#a8edea', '#fed6e3'], // Soft pastel
  ['#d299c2', '#fef9d7'], // Lavender cream
  ['#89f7fe', '#66a6ff'], // Sky blue
  ['#cd9cf2', '#f6f3ff'], // Lilac mist
  ['#ffecd2', '#fcb69f'], // Peach dawn
  ['#a1c4fd', '#c2e9fb'], // Morning sky
  ['#667db6', '#0082c8'], // Deep ocean
  ['#ff9a9e', '#fecfef'], // Rose petal
  ['#96fbc4', '#f9f586'], // Lime fizz
  ['#30cfd0', '#330867'], // Neon twilight
];

const SOLID_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
];

export const generateId = (): string => uuidv4();

export const generateGradient = (): string => {
  const palette = GRADIENT_PALETTES[Math.floor(Math.random() * GRADIENT_PALETTES.length)];
  const angle = Math.floor(Math.random() * 360);
  return `linear-gradient(${angle}deg, ${palette[0]}, ${palette[1]})`;
};

export const generateColor = (): string => {
  return SOLID_COLORS[Math.floor(Math.random() * SOLID_COLORS.length)];
};

export const generateCover = (): { cover: string; coverType: 'gradient' | 'color' } => {
  const useGradient = Math.random() > 0.3;
  if (useGradient) {
    return { cover: generateGradient(), coverType: 'gradient' };
  }
  return { cover: generateColor(), coverType: 'color' };
};

export const generatePlaceholderImage = (seed: string): string => {
  return `https://picsum.photos/seed/${seed}/400/300`;
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

// Local storage helpers
const STORAGE_KEY = 'wishlist-dock-data';

import type { Stack, Card } from '../types';

export interface StoredData {
  stacks: Stack[];
  cards: Card[];
}

export const saveToStorage = (data: StoredData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = (): StoredData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};
