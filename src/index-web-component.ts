/**
 * Web Component entry point for Wishlist Dock Widget
 * This file registers the custom element and exports the component class
 */

// Import the Web Component (it auto-registers itself)
import './components/Dock/WishlistDockElement';

// Re-export for programmatic usage
export { WishlistDockElement } from './components/Dock/WishlistDockElement';

// Export types for TypeScript users
export type {
  Stack,
  Card,
  Theme,
  WishlistState,
  DockConfig
} from './types';