# Embedding Guide

This comprehensive guide covers various methods for embedding the Wishlist Dock Widget in any website or application.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Embedding Methods](#embedding-methods)
- [Configuration Options](#configuration-options)
- [Advanced Examples](#advanced-examples)
- [Framework Integration](#framework-integration)
- [Customization](#customization)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)

## Overview

The Wishlist Dock Widget can be embedded in any website using one of the following methods:

1. **Web Component** (Recommended) - Shadow DOM for style isolation
2. **React Component** - Direct component usage in React apps
3. **Script Tag** - Simple vanilla JavaScript embedding
4. **ES Module** - Modern JavaScript modules

Each method offers different trade-offs between ease of use, customization, and framework compatibility.

## Quick Start

### Fastest Way (Script Tag)

```html
<!-- Add this to your HTML <head> or before </body> -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js"></script>

<!-- Add this where you want the widget to appear -->
<wishlist-dock data-theme="dark"></wishlist-dock>
```

### React App

```bash
npm install @your-org/wishlist-dock
```

```tsx
import { Dock } from '@your-org/wishlist-dock';
import '@your-org/wishlist-dock/dist/wishlist-dock.css';

function App() {
  return (
    <div>
      <YourContent />
      <Dock defaultTheme="dark" />
    </div>
  );
}
```

## Embedding Methods

### 1. Web Component (Recommended)

The Web Component approach provides complete style isolation using Shadow DOM, making it safe to embed on any website without CSS conflicts.

#### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
    <!-- Load the widget -->
    <script type="module" src="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js"></script>
</head>
<body>
    <!-- Your content -->
    <h1>My Awesome Website</h1>
    <p>Content goes here...</p>

    <!-- Embed the widget -->
    <wishlist-dock data-theme="dark"></wishlist-dock>
</body>
</html>
```

#### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-theme` | `light \| dark` | `dark` | Theme mode |
| `data-position` | `bottom-left \| bottom-right \| fixed` | `bottom-right` | Dock position |
| `data-open` | `boolean` | `false` | Start in open state |
| `data-compact` | `boolean` | `false` | Compact mode |

#### Example with All Attributes

```html
<wishlist-dock
  data-theme="light"
  data-position="bottom-left"
  data-open="false"
  data-compact="false">
</wishlist-dock>
```

#### JavaScript API

```javascript
// Get widget instance
const widget = document.querySelector('wishlist-dock');

// Listen to events
widget.addEventListener('open', () => {
  console.log('Widget opened');
});

widget.addEventListener('close', () => {
  console.log('Widget closed');
});

// Programmatically control
widget.open(); // Open the dock
widget.close(); // Close the dock
widget.setTheme('light'); // Change theme
```

### 2. React Component

For React applications, use the component directly for full control and customization.

#### Installation

```bash
# npm
npm install @your-org/wishlist-dock

# yarn
yarn add @your-org/wishlist-dock

# pnpm
pnpm add @your-org/wishlist-dock
```

#### Basic Usage

```tsx
import { Dock } from '@your-org/wishlist-dock';
import '@your-org/wishlist-dock/dist/wishlist-dock.css';

function App() {
  return <Dock defaultTheme="dark" />;
}
```

#### Props API

```typescript
interface DockProps {
  defaultTheme?: 'light' | 'dark';
  className?: string;
  position?: 'bottom-left' | 'bottom-right';
  open?: boolean;
  compact?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onThemeChange?: (theme: 'light' | 'dark') => void;
}
```

#### Advanced Example

```tsx
import { useState } from 'react';
import { Dock } from '@your-org/wishlist-dock';

function MyApp() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>My App</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          Toggle Wishlist
        </button>
      </header>

      <main>
        {/* Your app content */}
      </main>

      <Dock
        defaultTheme={theme}
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        onThemeChange={setTheme}
      />
    </div>
  );
}
```

### 3. Vanilla JavaScript (ES Module)

For modern JavaScript applications without React.

#### Module Import

```html
<script type="module">
  import { WishlistDock } from 'https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js';

  // Create instance
  const dock = new WishlistDock({
    target: document.body,
    props: {
      theme: 'dark',
      position: 'bottom-right'
    }
  });

  // Control programmatically
  document.addEventListener('keydown', (e) => {
    if (e.key === 'w' && e.ctrlKey) {
      dock.toggle();
    }
  });
</script>
```

#### Dynamic Loading

```javascript
// Load the widget dynamically
async function loadWishlistDock() {
  try {
    const module = await import('https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js');

    // Initialize
    const { WishlistDock } = module;
    const dock = new WishlistDock({
      target: document.querySelector('#wishlist-container'),
      props: { theme: 'light' }
    });

    return dock;
  } catch (error) {
    console.error('Failed to load widget:', error);
  }
}

// Load when needed
loadWishlistDock();
```

### 4. Iframe Embedding

For legacy websites or complete isolation.

```html
<iframe
  src="https://your-domain.com/wishlist-widget.html"
  style="
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border: none;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
  "
  title="Wishlist Dock">
</iframe>
```

## Configuration Options

### Theme Configuration

#### Light Theme

```html
<wishlist-dock data-theme="light"></wishlist-dock>
```

#### Dark Theme

```html
<wishlist-dock data-theme="dark"></wishlist-dock>
```

#### Custom Theme CSS (Advanced)

```css
/* Override widget styles */
wishlist-dock {
  --dock-primary: #4F46E5;
  --dock-background: #FFFFFF;
  --dock-text: #1F2937;
  --dock-border: #E5E7EB;
}

wishlist-dock[data-theme="dark"] {
  --dock-primary: #818CF8;
  --dock-background: #1F2937;
  --dock-text: #F9FAFB;
  --dock-border: #374151;
}
```

### Position Options

```html
<!-- Bottom right (default) -->
<wishlist-dock data-position="bottom-right"></wishlist-dock>

<!-- Bottom left -->
<wishlist-dock data-position="bottom-left"></wishlist-dock>
```

### Event Handling

```javascript
const widget = document.querySelector('wishlist-dock');

// Available events
widget.addEventListener('ready', () => {
  console.log('Widget is ready');
});

widget.addEventListener('open', () => {
  console.log('Widget opened');
});

widget.addEventListener('close', () => {
  console.log('Widget closed');
});

widget.addEventListener('themechange', (e) => {
  console.log('Theme changed to:', e.detail.theme);
});

widget.addEventListener('stackcreated', (e) => {
  console.log('Stack created:', e.detail.stack);
});

widget.addEventListener('cardadded', (e) => {
  console.log('Card added:', e.detail.card);
});
```

## Advanced Examples

### Multi-Widget Setup

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js"></script>
    <style>
        .widget-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
    </style>
</head>
<body>
    <!-- Multiple independent widgets -->
    <div class="widget-container">
        <wishlist-dock data-theme="dark" id="personal-wishlist"></wishlist-dock>
    </div>

    <div class="widget-container" style="top: 100px;">
        <wishlist-dock data-theme="light" id="work-wishlist"></wishlist-dock>
    </div>

    <script>
        // Configure each widget independently
        const personal = document.getElementById('personal-wishlist');
        const work = document.getElementById('work-wishlist');

        // Load different data for each widget
        personal.addEventListener('ready', () => {
            // Load personal stacks
            personal.loadFromStorage('personal-wishlist');
        });

        work.addEventListener('ready', () => {
            // Load work stacks
            work.loadFromStorage('work-wishlist');
        });
    </script>
</body>
</html>
```

### WordPress Integration

```php
// functions.php
function enqueue_wishlist_dock() {
    wp_enqueue_script(
        'wishlist-dock',
        'https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js',
        [],
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'enqueue_wishlist_dock');

// Shortcode for embedding
function wishlist_dock_shortcode($atts) {
    $atts = shortcode_atts(
        array(
            'theme' => 'dark',
            'position' => 'bottom-right'
        ),
        $atts
    );

    return '<wishlist-dock data-theme="' . esc_attr($atts['theme']) . '" data-position="' . esc_attr($atts['position']) . '"></wishlist-dock>';
}
add_shortcode('wishlist_dock', 'wishlist_dock_shortcode');
```

Use in WordPress:
```html
<!-- In posts/pages -->
[wishlist_dock theme="light" position="bottom-left"]
```

### Shopify Integration

```liquid
<!-- theme.liquid -->
{% if template contains 'product' %}
  <script type="module" src="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js"></script>
  <wishlist-dock data-theme="{{ settings.color_scheme }}"></wishlist-dock>
{% endif %}
```

## Framework Integration

### Vue.js

```vue
<template>
  <div>
    <h1>My Vue App</h1>
    <wishlist-dock :data-theme="theme"></wishlist-dock>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: 'dark'
    }
  },
  mounted() {
    // Load the script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js';
    document.head.appendChild(script);
  }
}
</script>
```

### Angular

```typescript
// app.module.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>My Angular App</h1>
    <div #wishlistContainer></div>
  `,
})
export class AppComponent {
  @ViewChild('wishlistContainer', { static: true }) container: ElementRef;

  ngOnInit() {
    // Load widget
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js';
    script.onload = () => {
      const widget = document.createElement('wishlist-dock');
      widget.setAttribute('data-theme', 'dark');
      this.container.nativeElement.appendChild(widget);
    };
    document.head.appendChild(script);
  }
}
```

### Svelte

```svelte
<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';

  let widgetContainer;

  onMount(async () => {
    // Load the widget script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js';

    await new Promise(resolve => {
      script.onload = resolve;
      document.head.appendChild(script);
    });

    // Create widget
    const widget = document.createElement('wishlist-dock');
    widget.setAttribute('data-theme', 'dark');
    widgetContainer.appendChild(widget);
  });
</script>

<main>
  <h1>My Svelte App</h1>
  <div bind:this={widgetContainer}></div>
</main>
```

## Customization

### CSS Variables Override

```css
:root {
  /* Primary colors */
  --dock-primary: #4F46E5;
  --dock-primary-hover: #4338CA;

  /* Background */
  --dock-bg: #FFFFFF;
  --dock-panel-bg: rgba(255, 255, 255, 0.95);

  /* Text */
  --dock-text: #1F2937;
  --dock-text-secondary: #6B7280;

  /* Border */
  --dock-border: #E5E7EB;
  --dock-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

wishlist-dock {
  /* Custom animations */
  --dock-animation-duration: 0.3s;
  --dock-animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Custom Initialization

```javascript
// Advanced configuration
const widget = document.querySelector('wishlist-dock');

// Set initial data
widget.addEventListener('ready', () => {
  // Pre-populate with data
  widget.setData({
    stacks: [
      {
        id: 'custom-1',
        name: 'My Custom Stack',
        cover: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    ],
    cards: []
  });

  // Set initial state
  widget.setState({
    theme: localStorage.getItem('theme') || 'dark'
  });
});

// Custom event handlers
widget.addEventListener('cardadded', (e) => {
  // Send analytics
  gtag('event', 'add_to_wishlist', {
    item_id: e.detail.card.id,
    item_name: e.detail.card.name
  });
});
```

## Performance Considerations

### Lazy Loading

```javascript
// Load widget only when needed
function loadWishlistWhenNeeded() {
  let loaded = false;

  return function() {
    if (!loaded) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js';
      document.head.appendChild(script);
      loaded = true;
    }
  };
}

// Example: Load on first hover
const loadOnHover = loadWishlistWhenNeeded();
document.addEventListener('DOMContentLoaded', () => {
  const triggerArea = document.querySelector('.wishlist-trigger');
  if (triggerArea) {
    triggerArea.addEventListener('mouseenter', loadOnHover, { once: true });
  }
});
```

### Bundle Optimization

```javascript
// Use dynamic imports for code splitting
async function initializeWishlist() {
  // Load only the core widget
  const { Dock } = await import('@your-org/wishlist-dock/core');

  // Load additional features on demand
  const { SwipeMode } = await import('@your-org/wishlist-dock/swipe-mode');

  // Initialize with features
  const dock = new Dock({
    features: [SwipeMode]
  });

  return dock;
}
```

### Caching Strategy

```javascript
// Cache the widget script
async function loadWidgetWithCache() {
  const CACHE_VERSION = '1.0.0';
  const CACHE_KEY = `wishlist-dock-${CACHE_VERSION}`;

  // Check cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const blob = new Blob([cached], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);

    const script = document.createElement('script');
    script.type = 'module';
    script.src = url;
    document.head.appendChild(script);
    return;
  }

  // Load from network
  const response = await fetch('https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js');
  const content = await response.text();

  // Cache for future
  localStorage.setItem(CACHE_KEY, content);

  // Execute
  eval(content);
}
```

## Troubleshooting

### Common Issues

#### Widget Not Appearing

```javascript
// Debug: Check if script loaded
console.log('Widget script loaded:', typeof customElements.get('wishlist-dock') !== 'undefined');

// Debug: Check if element exists
const widget = document.querySelector('wishlist-dock');
console.log('Widget element:', widget);
```

#### CSS Conflicts

```css
/* Fix conflicting styles */
wishlist-dock {
  all: initial;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Or use Shadow DOM */
wishlist-dock::part(button) {
  /* Style internal button */
}
```

#### JavaScript Errors

```javascript
// Add error boundary
window.addEventListener('error', (e) => {
  if (e.filename.includes('wishlist-dock')) {
    console.error('Wishlist Dock error:', e.error);
    // Fallback: show simple button
    showFallbackWishlistButton();
  }
});
```

### Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 67 | Full support |
| Firefox | 63 | Full support |
| Safari | 13.1 | Full support |
| Edge | 79 | Full support |
| IE | - | Not supported |

### Polyfills for Older Browsers

```html
<!-- For browsers without native Web Components -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6,CustomEvent,Element.prototype.closest,Element.prototype.matches"></script>
```

### Support

For additional help:
1. Check the [GitHub Issues](https://github.com/your-username/Wishlist-Dock/issues)
2. Review the [API Documentation](./API.md)
3. Create a new issue with details about your setup

---

This embedding guide should help you integrate the Wishlist Dock Widget into any website or application. For more advanced use cases, check out the [Architecture Documentation](./ARCHITECTURE.md) and [API Reference](./API.md).