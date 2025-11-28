import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '../../store/wishlistStore';
import { StacksList } from '../Stack/StacksList';
import { StackView } from '../Stack/StackView';
import { Icons } from '../ui/Icons';

interface DockProps {
  defaultTheme?: 'light' | 'dark';
}

export const Dock = ({ defaultTheme = 'dark' }: DockProps) => {
  const {
    isOpen,
    toggleDock,
    closeDock,
    activeStackId,
    syncStatus,
    errorMessage,
    clearError,
    theme,
    setTheme,
    initializeFromStorage,
    stacks,
    cards,
  } = useWishlistStore();
  
  // Initialize data from storage on mount
  useEffect(() => {
    initializeFromStorage();
    setTheme(defaultTheme);
  }, [initializeFromStorage, setTheme, defaultTheme]);
  
  // Total card count for badge
  const totalCards = cards.length;
  
  return (
    <div className="wishlist-dock-container">
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDock}
            className="fixed bottom-6 right-6 z-[9999] group"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              
              {/* Button */}
              <div className="relative w-14 h-14 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-violet-500/25">
                <Icons.Bookmark className="w-6 h-6 text-white" />
              </div>
              
              {/* Badge */}
              {totalCards > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-violet-600 shadow-lg"
                >
                  {totalCards > 99 ? '99+' : totalCards}
                </motion.div>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (mobile only) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[9998] sm:hidden"
              onClick={closeDock}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`
                fixed z-[9999]
                bottom-0 right-0 left-0 h-[85vh]
                sm:bottom-6 sm:right-6 sm:left-auto sm:h-[600px] sm:w-[400px]
                ${theme === 'dark' 
                  ? 'bg-slate-900/95 border-white/10' 
                  : 'bg-white/95 border-gray-200'
                }
                backdrop-blur-xl rounded-t-3xl sm:rounded-3xl 
                border shadow-2xl shadow-black/20
                flex flex-col overflow-hidden
              `}
            >
              {/* Header */}
              <div className={`
                flex items-center justify-between px-4 py-3 
                border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}
              `}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Icons.Bookmark className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Wishlist
                    </h1>
                    <p className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
                      {stacks.length} stacks · {totalCards} cards
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Sync indicator */}
                  {syncStatus === 'syncing' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="text-violet-400"
                    >
                      <Icons.Sync size={16} />
                    </motion.div>
                  )}
                  
                  {/* Close button */}
                  <button
                    onClick={closeDock}
                    className={`
                      p-2 rounded-full transition-colors
                      ${theme === 'dark' 
                        ? 'hover:bg-white/10 text-white/60 hover:text-white' 
                        : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                      }
                    `}
                  >
                    <Icons.X size={20} />
                  </button>
                </div>
              </div>
              
              {/* Error Banner */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-red-500/10 border-b border-red-500/20"
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Icons.AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                      <p className="text-red-300 text-sm flex-1">{errorMessage}</p>
                      <button
                        onClick={clearError}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Icons.X size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeStackId ? (
                    <motion.div
                      key="stack-view"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full"
                    >
                      <StackView />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="stacks-list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="h-full"
                    >
                      <StacksList />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dock;
