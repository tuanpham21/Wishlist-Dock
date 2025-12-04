# Shadow DOM Implementation

This document explains how the Wishlist Dock Widget implements Shadow DOM for style isolation and the CSS loading mechanism.

## Overview

The widget uses Web Components with Shadow DOM to ensure complete style isolation from the host page. This prevents CSS conflicts and guarantees consistent appearance regardless of where it's embedded.

## How It Works

### 1. Custom Element Registration

```typescript
// src/components/Dock/WishlistDockElement.tsx
class WishlistDockElement extends HTMLElement {
  // ...
}

// Register the custom element
customElements.define('wishlist-dock', WishlistDockElement);
```

### 2. Shadow DOM Creation

When the element is connected to the DOM:

```typescript
connectedCallback() {
  // Create a shadow root with 'open' mode (accessible via JavaScript)
  const shadow = this.attachShadow({ mode: 'open' });

  // Create mount point for React
  this.mountPoint = document.createElement('div');
  this.mountPoint.id = 'wishlist-dock-root';

  // Position the widget
  this.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 99999;
  `;

  // Create style element for CSS injection
  const style = document.createElement('style');
  shadow.appendChild(style);
  shadow.appendChild(this.mountPoint);

  // Load CSS and mount React
  this.loadCssAndMount(style);
}
```

### 3. CSS Loading and Injection

The widget fetches its CSS file and injects it into the Shadow DOM:

```typescript
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
  this.root = ReactDOM.createRoot(this.mountPoint);
  this.render();
}
```

## Benefits

### 1. Style Isolation
- Widget styles don't leak to the host page
- Host page styles don't affect the widget
- No need for CSS naming conventions or CSS-in-JS

### 2. Predictable Appearance
- Widget looks identical regardless of where it's embedded
- No conflicts with existing CSS frameworks on the host page
- Reliable theming support

### 3. Encapsulation
- DOM structure is hidden from the host page
- Internal implementation can change without affecting consumers
- Clean API surface

## Implementation Details

### CSS Loading Strategy

1. **Preload CSS in Host Page**: The demo.html loads the CSS file explicitly:
   ```html
   <link rel="stylesheet" href="/wishlist-dock.css" />
   ```

2. **Fetch and Inject**: The Web Component fetches the CSS and injects it into Shadow DOM:
   ```typescript
   const response = await fetch('/wishlist-dock.css');
   styleElement.textContent = await response.text();
   ```

3. **Fallback Handling**: If CSS fails to load, minimal fallback styles are provided

### Attribute Observing

The widget observes theme changes via attributes:

```typescript
static get observedAttributes() {
  return ['data-theme'];
}

attributeChangedCallback(_name: string, oldValue: string, newValue: string) {
  if (oldValue !== newValue) {
    this.render(); // Re-render with new theme
  }
}
```

## Usage Examples

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Load widget CSS first -->
  <link rel="stylesheet" href="/wishlist-dock.css" />
</head>
<body>
  <!-- Your content here -->

  <!-- Load widget module -->
  <script type="module" src="/wishlist-dock.es.js"></script>

  <!-- Use the widget -->
  <wishlist-dock data-theme="dark"></wishlist-dock>
</body>
</html>
```

### Theme Switching

```javascript
// Get the widget element
const widget = document.querySelector('wishlist-dock');

// Switch to light theme
widget.setAttribute('data-theme', 'light');

// Switch to dark theme
widget.setAttribute('data-theme', 'dark');
```

## Browser Support

Shadow DOM is supported in all modern browsers:
- Chrome 54+
- Firefox 63+
- Safari 10+
- Edge 79+

## Troubleshooting

### Widget Not Appearing

1. Check browser console for errors
2. Ensure CSS file is accessible at `/wishlist-dock.css`
3. Verify the module loads without errors

### Styles Not Applied

1. Check if CSS file loads correctly (Network tab in DevTools)
2. Look for "CSS loaded for Shadow DOM" message in console
3. Verify the shadow root contains style elements

### Performance Considerations

- CSS is fetched asynchronously to prevent blocking
- React mounts only after CSS is loaded
- Shadow DOM creation is lightweight
- No runtime CSS processing overhead

## Future Enhancements

1. **CSS Inlining**: Bundle CSS directly in JS for single-file deployment
2. **Dynamic Theming**: Support for custom color schemes
3. **Size Optimization**: Tree-shake unused CSS for smaller bundles
4. **CSS Variables**: Use CSS custom properties for better theme switching