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
    
    // Inject styles
    const styles = document.createElement('style');
    styles.textContent = this.getStyles();
    
    shadow.appendChild(styles);
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
  
  private getStyles(): string {
    // Include critical styles - in production this would be the compiled CSS
    return `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      * {
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
      
      /* Tailwind-like utilities */
      .fixed { position: fixed; }
      .absolute { position: absolute; }
      .relative { position: relative; }
      .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
      
      .flex { display: flex; }
      .grid { display: grid; }
      .hidden { display: none; }
      .block { display: block; }
      .inline-flex { display: inline-flex; }
      
      .flex-col { flex-direction: column; }
      .flex-1 { flex: 1 1 0%; }
      .flex-shrink-0 { flex-shrink: 0; }
      
      .items-center { align-items: center; }
      .items-end { align-items: flex-end; }
      .justify-center { justify-content: center; }
      .justify-between { justify-content: space-between; }
      
      .gap-2 { gap: 0.5rem; }
      .gap-3 { gap: 0.75rem; }
      .gap-4 { gap: 1rem; }
      .gap-8 { gap: 2rem; }
      
      .p-2 { padding: 0.5rem; }
      .p-3 { padding: 0.75rem; }
      .p-4 { padding: 1rem; }
      .p-6 { padding: 1.5rem; }
      .p-8 { padding: 2rem; }
      
      .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
      .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      
      .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
      .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
      
      .m-0 { margin: 0; }
      .mb-1 { margin-bottom: 0.25rem; }
      .mb-2 { margin-bottom: 0.5rem; }
      .mb-3 { margin-bottom: 0.75rem; }
      .mb-4 { margin-bottom: 1rem; }
      .mb-6 { margin-bottom: 1.5rem; }
      .mt-1 { margin-top: 0.25rem; }
      .mt-4 { margin-top: 1rem; }
      
      .w-full { width: 100%; }
      .h-full { height: 100%; }
      .min-w-0 { min-width: 0; }
      
      .overflow-hidden { overflow: hidden; }
      .overflow-y-auto { overflow-y: auto; }
      
      .rounded-full { border-radius: 9999px; }
      .rounded-xl { border-radius: 0.75rem; }
      .rounded-2xl { border-radius: 1rem; }
      .rounded-3xl { border-radius: 1.5rem; }
      
      .border { border-width: 1px; }
      .border-b { border-bottom-width: 1px; }
      
      .text-center { text-align: center; }
      .text-left { text-align: left; }
      
      .text-xs { font-size: 0.75rem; line-height: 1rem; }
      .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
      .text-base { font-size: 1rem; line-height: 1.5rem; }
      .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
      .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
      
      .font-medium { font-weight: 500; }
      .font-semibold { font-weight: 600; }
      .font-bold { font-weight: 700; }
      
      .text-white { color: white; }
      
      .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .line-clamp-1 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      
      .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      
      .line-clamp-3 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
      
      .cursor-pointer { cursor: pointer; }
      .cursor-grab { cursor: grab; }
      .cursor-grabbing { cursor: grabbing; }
      
      .transition-all { transition: all 0.2s ease; }
      .transition-colors { transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease; }
      .transition-opacity { transition: opacity 0.2s ease; }
      .transition-transform { transition: transform 0.2s ease; }
      
      .duration-200 { transition-duration: 200ms; }
      .duration-300 { transition-duration: 300ms; }
      .duration-500 { transition-duration: 500ms; }
      
      .opacity-0 { opacity: 0; }
      .opacity-25 { opacity: 0.25; }
      .opacity-50 { opacity: 0.5; }
      .opacity-75 { opacity: 0.75; }
      
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
      .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
      
      .backdrop-blur-sm { backdrop-filter: blur(4px); }
      .backdrop-blur-xl { backdrop-filter: blur(24px); }
      
      .z-10 { z-index: 10; }
      .z-50 { z-index: 50; }
      
      .resize-none { resize: none; }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .animate-spin { animation: spin 1s linear infinite; }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
      }
      
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    `;
  }
}

// Register the custom element
if (!customElements.get('wishlist-dock')) {
  customElements.define('wishlist-dock', WishlistDockElement);
}

export { WishlistDockElement };
