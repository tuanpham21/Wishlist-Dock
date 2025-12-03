import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useWishlistStore } from '../../store/wishlistStore';
import { StackItem } from './StackItem';
import { CreateStackForm } from './CreateStackForm';
import { EditStackForm } from './EditStackForm';
import { Button } from '../ui/Button';
import { Icons } from '../ui/Icons';

export const StacksList = () => {
  const {
    stacks,
    cards,
    setActiveStack,
    deleteStack,
    isCreatingStack,
    setIsCreatingStack,
    theme,
  } = useWishlistStore();

  const [editingStackId, setEditingStackId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const editingStack = editingStackId ? stacks.find(s => s.id === editingStackId) : null;

  // Filter stacks based on search query
  const filteredStacks = stacks.filter(stack =>
    stack.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteStack = async (stackId: string) => {
    const stack = stacks.find(s => s.id === stackId);
    const cardCount = cards.filter(c => c.stackId === stackId).length;
    
    const message = cardCount > 0
      ? `Delete "${stack?.name}" and its ${cardCount} cards?`
      : `Delete "${stack?.name}"?`;
    
    if (window.confirm(message)) {
      await deleteStack(stackId);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} space-y-3`}>
        <div className="flex items-center justify-between">
          <h2 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Collections</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCreatingStack(true)}
            leftIcon={<Icons.Plus size={16} />}
          >
            New
          </Button>
        </div>

        {/* Search Input */}
        {stacks.length > 0 && (
          <div className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-white/40' : 'text-gray-400'}`}>
              <Icons.Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search stacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm ${
                theme === 'dark'
                  ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/40'
                  : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                  theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icons.X size={16} />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Stacks Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredStacks.length === 0 && searchQuery ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center py-12"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
              <Icons.Search className={`w-8 h-8 ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`} />
            </div>
            <h3 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>No stacks found</h3>
            <p className={`text-sm mb-6 max-w-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
              Try searching with a different keyword
            </p>
            <Button
              variant="secondary"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </motion.div>
        ) : stacks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center py-12"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
              <Icons.Layers className={`w-8 h-8 ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`} />
            </div>
            <h3 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>No stacks yet</h3>
            <p className={`text-sm mb-6 max-w-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
              Create your first stack to start organizing your content
            </p>
            <Button
              onClick={() => setIsCreatingStack(true)}
              leftIcon={<Icons.FolderPlus size={18} />}
            >
              Create Stack
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredStacks.map((stack, index) => (
                <StackItem
                  key={stack.id}
                  stack={stack}
                  cardCount={cards.filter(c => c.stackId === stack.id).length}
                  index={index}
                  onClick={() => setActiveStack(stack.id)}
                  onDelete={handleDeleteStack}
                  onEdit={(stackId) => setEditingStackId(stackId)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Create Stack Form */}
      <AnimatePresence>
        {isCreatingStack && (
          <CreateStackForm onClose={() => setIsCreatingStack(false)} />
        )}
      </AnimatePresence>

      {/* Edit Stack Form */}
      <AnimatePresence>
        {editingStack && (
          <EditStackForm
            stack={editingStack}
            onClose={() => setEditingStackId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
