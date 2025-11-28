import { AnimatePresence, motion } from 'framer-motion';
import { useWishlistStore } from '../../store/wishlistStore';
import { StackItem } from './StackItem';
import { CreateStackForm } from './CreateStackForm';
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
  } = useWishlistStore();
  
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
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-white font-semibold text-lg">My Collections</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCreatingStack(true)}
          leftIcon={<Icons.Plus size={16} />}
        >
          New
        </Button>
      </div>
      
      {/* Stacks Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {stacks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Icons.Layers className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-white/80 font-medium mb-2">No stacks yet</h3>
            <p className="text-white/50 text-sm mb-6 max-w-xs">
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
              {stacks.map((stack, index) => (
                <StackItem
                  key={stack.id}
                  stack={stack}
                  cardCount={cards.filter(c => c.stackId === stack.id).length}
                  index={index}
                  onClick={() => setActiveStack(stack.id)}
                  onDelete={handleDeleteStack}
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
    </div>
  );
};
