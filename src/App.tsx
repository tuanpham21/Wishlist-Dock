import { Dock } from './components';

function App() {
  return (
    <>
      {/* Demo page content */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Decorative background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-3xl" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          {/* Hero Section */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-violet-300 text-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              Wishlist Dock Widget
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Organize Your
              <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 text-transparent bg-clip-text">
                Digital Life
              </span>
            </h1>
            
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              A beautiful, embeddable wishlist widget that helps users save and organize 
              content from any website. Create stacks, add cards, and swipe through your collections.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#features"
                className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105"
              >
                Explore Features
              </a>
              <a
                href="#usage"
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                View Usage
              </a>
            </div>
          </div>
          
          {/* Features Section */}
          <section id="features" className="py-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Features</h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Stack Management */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-violet-500/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Stack Management</h3>
                <p className="text-white/60 text-sm">
                  Create and organize collections with beautiful auto-generated covers. 
                  Group your content by topics, projects, or any way you prefer.
                </p>
              </div>
              
              {/* Card System */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-violet-500/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Card System</h3>
                <p className="text-white/60 text-sm">
                  Add items with images, titles, and descriptions. Move cards between 
                  stacks with drag-and-drop or quick actions.
                </p>
              </div>
              
              {/* Swipe Mode */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-violet-500/50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" />
                    <rect width="6" height="10" x="16" y="12" rx="2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Swipe Mode</h3>
                <p className="text-white/60 text-sm">
                  Browse your cards in a fun, Tinder-like interface. Swipe through 
                  your collection with smooth animations.
                </p>
              </div>
            </div>
          </section>
          
          {/* Usage Section */}
          <section id="usage" className="py-20">
            <h2 className="text-3xl font-bold text-white text-center mb-4">Embedding the Widget</h2>
            <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
              Add the wishlist dock to any website with a simple script tag
            </p>
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <pre className="text-sm text-white/80 overflow-x-auto">
                  <code>{`<!-- Include the widget script -->
<script src="https://your-cdn.com/wishlist-dock.js"></script>

<!-- Add the widget to your page -->
<wishlist-dock data-theme="dark"></wishlist-dock>`}</code>
                </pre>
              </div>
              
              <div className="mt-6 p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                <p className="text-violet-300 text-sm">
                  💡 <strong>Tip:</strong> Click the floating button in the bottom-right corner to try the widget!
                </p>
              </div>
            </div>
          </section>
          
          {/* Tech Stack */}
          <section className="py-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Built With</h2>
            
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
              {['React 18', 'TypeScript', 'Zustand', 'Framer Motion', 'Tailwind CSS', 'Vite'].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      {/* The Wishlist Dock Widget */}
      <Dock defaultTheme="dark" />
    </>
  );
}

export default App
