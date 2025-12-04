import React from 'react';
import ReactDOM from 'react-dom/client';
import { Dock } from './Dock';

// Create a custom element for the wishlist dock
class WishlistDockElement extends HTMLElement {
  private root: ReactDOM.Root | null = null;
  private mountPoint: HTMLDivElement | null = null;

  static get observedAttributes() {
    return ['data-theme'];
  }

  connectedCallback() {
    // Create shadow DOM for style isolation
    const shadow = this.attachShadow({ mode: 'open' });

    // Create mount point
    this.mountPoint = document.createElement('div');
    this.mountPoint.id = 'wishlist-dock-root';

    // Basic styling for the shadow host
    this.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
    `;

    // Create a style element for the Shadow DOM
    const style = document.createElement('style');
    shadow.appendChild(style);
    shadow.appendChild(this.mountPoint);

    // Load CSS and then mount React
    this.loadCssAndMount(style);
  }

  private async loadCssAndMount(styleElement: HTMLStyleElement) {
    try {
      // Try to fetch the widget's CSS file
      const response = await fetch('/wishlist-dock.css');
      if (response.ok) {
        const cssText = await response.text();
        styleElement.textContent = cssText;
        console.log('✅ CSS loaded for Shadow DOM');
      } else {
        throw new Error('CSS file not found');
      }
    } catch (error) {
      console.warn('Could not load widget CSS, using basic styles:', error);
      // Fallback minimal styles
      styleElement.textContent = `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      `;
    }

    // Mount React component after CSS is loaded
    console.log('🔄 Mounting React component in Shadow DOM...');
    if (this.mountPoint) {
      this.root = ReactDOM.createRoot(this.mountPoint);
      this.render();
      console.log('✅ React component mounted in Shadow DOM');
    }
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  private render() {
    if (!this.root) return;

    const theme = (this.getAttribute('data-theme') as 'light' | 'dark') || 'dark';

    this.root.render(
      React.createElement(Dock, { defaultTheme: theme })
    );
  }
}

// Register the custom element
if (typeof customElements !== 'undefined' && !customElements.get('wishlist-dock')) {
  customElements.define('wishlist-dock', WishlistDockElement);
}

export { WishlistDockElement };