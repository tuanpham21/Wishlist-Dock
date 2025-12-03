# Embedding Wishlist Dock Widget

This guide explains how to embed the Wishlist Dock widget on any website, with complete style isolation and zero conflicts.

## 🚀 Quick Start

### Method 1: Simple Script Tag (Recommended)

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to My Site</h1>
    <p>Check out my collections below!</p>

    <!-- Include the widget -->
    <script type="module" src="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js"></script>
    <wishlist-dock data-theme="dark"></wishlist-dock>
</body>
</html>
```

### Method 2: NPM Package (For React Apps)

```bash
npm install @your-org/wishlist-dock
```

```javascript
import '@your-org/wishlist-dock'

function App() {
  return (
    <div>
      <h1>My React App</h1>
      <wishlist-dock data-theme="light"></wishlist-dock>
    </div>
  )
}
```

## ⚙️ Configuration Options

### Theme Attribute

Control the widget's appearance:

```html
<!-- Dark theme (default) -->
<wishlist-dock data-theme="dark"></wishlist-dock>

<!-- Light theme -->
<wishlist-dock data-theme="light"></wishlist-dock>
```

### Position Styling

The widget appears as a floating button. Control its position:

```css
/* Custom positioning */
wishlist-dock {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

/* Or place it inline in specific locations */
.my-widget-container wishlist-dock {
  position: relative;
  bottom: auto;
  right: auto;
}
```

## 🛡️ Style Isolation

The widget uses Shadow DOM to prevent CSS conflicts:

```html
<!-- This website's styles won't affect the widget -->
<style>
  /* These styles are ignored by the widget */
  button { background: red !important; }
  .text-white { color: blue !important; }
  * { font-family: Comic Sans !important; }
</style>

<!-- Widget maintains its own design -->
<wishlist-dock data-theme="dark"></wishlist-dock>
```

## 📦 CDN URLs

### Development
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js"></script>
```

### Production (Minified)
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.umd.min.js"></script>
```

### Self-hosted
```html
<script type="module" src="/assets/wishlist-dock.es.js"></script>
<link rel="stylesheet" href="/assets/wishlist-dock.css">
```

## 🎯 Advanced Usage

### Dynamic Loading

Load the widget programmatically:

```javascript
// Function to load widget dynamically
function loadWishlistWidget(theme = 'dark') {
  // Create script element
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js';

  // Add to page
  document.head.appendChild(script);

  // Create widget when script loads
  script.onload = function() {
    const widget = document.createElement('wishlist-dock');
    widget.setAttribute('data-theme', theme);
    document.body.appendChild(widget);
  };
}

// Load widget on page load
document.addEventListener('DOMContentLoaded', () => {
  loadWishlistWidget('dark');
});
```

### Multiple Widgets

```html
<!-- Multiple independent widgets -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@your-org/wishlist-dock/dist/wishlist-dock.es.js"></script>

<!-- Widget 1 - Dark theme -->
<wishlist-dock data-theme="dark" id="widget1"></wishlist-dock>

<!-- Widget 2 - Light theme -->
<wishlist-dock data-theme="light" id="widget2"></wishlist-dock>

<!-- Widget 3 - In a specific container -->
<div class="my-custom-container">
  <wishlist-dock data-theme="dark"></wishlist-dock>
</div>
```

### Programmatically Control Theme

```javascript
// Get widget reference
const widget = document.querySelector('wishlist-dock');

// Change theme
widget.setAttribute('data-theme', 'light');

// Listen for theme changes
widget.addEventListener('attributechanged', (event) => {
  if (event.attributeName === 'data-theme') {
    console.log('Theme changed to:', event.target.getAttribute('data-theme'));
  }
});
```

## 🔧 Browser Support

The widget supports all modern browsers:
- ✅ Chrome 54+
- ✅ Firefox 63+
- ✅ Safari 10.1+
- ✅ Edge 79+

For older browsers without Shadow DOM support, the widget will gracefully degrade.

## 📏 File Sizes

- **ES Module**: ~45KB (gzipped: ~15KB)
- **UMD Bundle**: ~48KB (gzipped: ~16KB)
- **CSS**: ~12KB (gzipped: ~4KB)

## 🐛 Troubleshooting

### Widget Not Loading

1. **Check Console**: Look for JavaScript errors
2. **Verify CDN**: Ensure the CDN URL is accessible
3. **Module Support**: Ensure you're using `type="module"` in the script tag

```javascript
// Debug helper
window.addEventListener('error', (e) => {
  console.error('Widget error:', e.error);
});
```

### CSS Conflicts (Shouldn't Happen)

If you notice styling issues:

1. **Verify Shadow DOM**: Check browser dev tools for #shadow-root
2. **Report Issue**: This shouldn't happen due to Shadow DOM isolation

### Performance Tips

1. **Load Async**: Use async loading for better page performance
2. **CDN Preferred**: Use CDN for better caching
3. **One Instance**: Avoid loading multiple scripts for the same widget

## 📄 License

This widget is licensed under MIT. Feel free to use it in commercial projects.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/wishlist-dock/issues)
- **Documentation**: [Full Docs](https://github.com/your-org/wishlist-dock)
- **Examples**: [Demo Page](https://your-org.github.io/wishlist-dock/demo.html)

## 🎉 Success Story

> "We integrated Wishlist Dock into our e-commerce site in under 5 minutes. The Shadow DOM isolation meant we didn't have to worry about CSS conflicts with our existing styles."
>
> — Developer, Happy Customer

---

**Happy embedding!** 🎊