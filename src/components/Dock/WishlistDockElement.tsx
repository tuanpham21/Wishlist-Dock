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

    // Load external CSS file into shadow DOM
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = '/wishlist-dock.css';
    shadow.appendChild(cssLink);

    // Inject minimal essential styles
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      *, ::before, ::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      #wishlist-dock-root {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Tailwind-like utilities for the widget */
      .fixed { position: fixed !important; }
      .absolute { position: absolute !important; }
      .relative { position: relative !important; }
      .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
      .bottom-0 { bottom: 0 !important; }
      .right-0 { right: 0 !important; }
      .left-0 { left: 0 !important; }
      .top-0 { top: 0 !important; }
      .z-50 { z-index: 50 !important; }
      .z-40 { z-index: 40 !important; }
      .z-50 { z-index: 50 !important; }
      .z-\\[9999\\] { z-index: 9999 !important; }
      .z-\\[9998\\] { z-index: 9998 !important; }

      .flex { display: flex !important; }
      .grid { display: grid !important; }
      .hidden { display: none !important; }
      .block { display: block !important; }
      .inline-flex { display: inline-flex !important; }

      .flex-col { flex-direction: column !important; }
      .flex-1 { flex: 1 1 0% !important; }
      .flex-shrink-0 { flex-shrink: 0 !important; }

      .items-center { align-items: center !important; }
      .items-end { align-items: flex-end !important; }
      .items-start { align-items: flex-start !important; }
      .justify-center { justify-content: center !important; }
      .justify-between { justify-content: space-between !important; }
      .justify-end { justify-content: flex-end !important; }

      .gap-2 { gap: 0.5rem !important; }
      .gap-3 { gap: 0.75rem !important; }
      .gap-4 { gap: 1rem !important; }
      .gap-6 { gap: 1.5rem !important; }
      .gap-8 { gap: 2rem !important; }

      .w-14 { width: 3.5rem !important; }
      .h-14 { height: 3.5rem !important; }
      .w-full { width: 100% !important; }
      .h-full { height: 100% !important; }
      .h-\\[85vh\\] { height: 85vh !important; }
      .h-\\[600px\\] { height: 600px !important; }
      .min-w-\\[22px\\] { min-width: 22px !important; }
      .h-\\[22px\\] { height: 22px !important; }

      .p-2 { padding: 0.5rem !important; }
      .p-4 { padding: 1rem !important; }
      .p-6 { padding: 1.5rem !important; }
      .px-1\\.5 { padding-left: 0.375rem !important; padding-right: 0.375rem !important; }
      .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
      .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }

      .m-0 { margin: 0 !important; }
      .mb-6 { margin-bottom: 1.5rem !important; }
      .mr-2 { margin-right: 0.5rem !important; }
      .ml-2 { margin-left: 0.5rem !important; }

      .rounded-full { border-radius: 9999px !important; }
      .rounded-3xl { border-radius: 1.5rem !important; }
      .rounded-xl { border-radius: 0.75rem !important; }
      .rounded-t-3xl { border-top-left-radius: 1.5rem !important; border-top-right-radius: 1.5rem !important; }

      .bg-white\\/95 { background-color: rgba(255, 255, 255, 0.95) !important; }
      .bg-slate-900\\/95 { background-color: rgba(15, 23, 42, 0.95) !important; }
      .bg-violet-500 { background-color: #8b5cf6 !important; }
      .bg-purple-600 { background-color: #9333ea !important; }
      .bg-red-400\\/20 { background-color: rgba(248, 113, 113, 0.2) !important; }
      .bg-red-500\\/20 { background-color: rgba(239, 68, 68, 0.2) !important; }

      .text-white { color: white !important; }
      .text-white\\/60 { color: rgba(255, 255, 255, 0.6) !important; }
      .text-white\\/50 { color: rgba(255, 255, 255, 0.5) !important; }
      .text-gray-400 { color: #9ca3af !important; }
      .text-gray-600 { color: #4b5563 !important; }
      .text-gray-500 { color: #6b7280 !important; }
      .text-gray-900 { color: #111827 !important; }
      .text-violet-600 { color: #8b5cf6 !important; }
      .text-red-400 { color: #f87171 !important; }
      .text-red-300 { color: #fca5a5 !important; }
      .text-xs { font-size: 0.75rem !important; }
      .text-sm { font-size: 0.875rem !important; }
      .text-xl { font-size: 1.25rem !important; }
      .font-semibold { font-weight: 600 !important; }
      .font-bold { font-weight: 700 !important; }

      .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important; }
      .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }
      .shadow-violet-500\\/25 { box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.25) !important; }
      .shadow-black\\/20 { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2) !important; }

      .border { border-width: 1px !important; }
      .border-white\\/10 { border-color: rgba(255, 255, 255, 0.1) !important; }
      .border-gray-200 { border-color: #e5e7eb !important; }

      .backdrop-blur-xl { backdrop-filter: blur(24px) !important; }
      .transition-colors { transition-property: color, background-color, border-color !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
      .transition-all { transition-property: all !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }

      .hover\\:bg-gray-100:hover { background-color: #f3f4f6 !important; }
      .hover\\:bg-gray-200:hover { background-color: #e5e7eb !important; }
      .hover\\:bg-white\\/10:hover { background-color: rgba(255, 255, 255, 0.1) !important; }
      .hover\\:text-gray-600:hover { color: #4b5563 !important; }
      .hover\\:text-white:hover { color: white !important; }
      .hover\\:scale-110:hover { transform: scale(1.1) !important; }
      .hover\\:opacity-75:hover { opacity: 0.75 !important; }
      .hover\\:border-white\\/20:hover { border-color: rgba(255, 255, 255, 0.2) !important; }

      .group:hover .group-hover\\:text-white { color: white !important; }
      .group:hover .group-hover\\:opacity-75 { opacity: 0.75 !important; }
    `;

    // Add elements to shadow DOM
    shadow.appendChild(style);
    shadow.appendChild(this.mountPoint);

    // Mount React app
    this.root = ReactDOM.createRoot(this.mountPoint);
    this.render();
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