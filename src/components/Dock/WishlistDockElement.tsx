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
    this.root = ReactDOM.createRoot(this.mountPoint);
    this.render();
    console.log('✅ React component mounted in Shadow DOM');
  }

  private loadStylesAsync(shadow: ShadowRoot) {
    // Clone all existing styles from document head into shadow DOM
    const documentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');

    documentStyles.forEach(styleElement => {
      if (styleElement.tagName === 'STYLE') {
        // Clone inline styles
        const shadowStyle = document.createElement('style');
        shadowStyle.textContent = styleElement.textContent;
        shadow.appendChild(shadowStyle);
      } else if (styleElement.tagName === 'LINK' && styleElement.getAttribute('rel') === 'stylesheet') {
        // For external stylesheets, we'll try to fetch them
        const href = styleElement.getAttribute('href');
        if (href && !href.startsWith('data:')) {
          fetch(href)
            .then(response => {
              if (response.ok) {
                return response.text();
              }
              throw new Error(`Failed to load ${href}`);
            })
            .then(cssText => {
              const shadowStyle = document.createElement('style');
              shadowStyle.textContent = cssText;
              shadow.appendChild(shadowStyle);
              // Force a re-render after styles are loaded
              this.render();
            })
            .catch(error => {
              console.warn(`Could not fetch stylesheet ${href}:`, error);
            });
        }
      }
    });

    // Also try to load the specific widget CSS
    const widgetCssUrl = '/wishlist-dock.css';
    fetch(widgetCssUrl)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        throw new Error(`Widget CSS not found`);
      })
      .then(cssText => {
        const widgetStyle = document.createElement('style');
        widgetStyle.textContent = cssText;
        shadow.appendChild(widgetStyle);
        console.log('✅ Widget CSS loaded successfully');
        // Force a re-render after styles are loaded
        this.render();
      })
      .catch(error => {
        console.warn('Could not load widget CSS:', error);
      });
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