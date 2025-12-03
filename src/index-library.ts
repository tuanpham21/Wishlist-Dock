/**
 * Library entry point for Wishlist Dock Widget
 * Includes styles and registers the web component
 */

// Import styles first
import './styles/main.css';

// Import and register the web component
import './components/Dock/WishlistDockElement';

// Auto-register the element if not already registered
if (typeof customElements !== 'undefined' && !customElements.get('wishlist-dock')) {
  // Import will register it automatically
}

// Export for TypeScript users
export type {
  Stack,
  Card,
  Theme,
  WishlistState,
} from './types';