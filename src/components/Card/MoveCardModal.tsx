import { motion } from 'framer-motion';
import type { Stack } from '../../types';
import { useWishlistStore } from '../../store/wishlistStore';

interface MoveCardModalProps {
  cardId: string;
  currentStackId: string;
  stacks: Stack[];
  onMove: (cardId: string, toStackId: string) => void;
  onClose: () => void;
}

export const MoveCardModal = ({ cardId, currentStackId, stacks, onMove, onClose }: MoveCardModalProps) => {
  const theme = useWishlistStore(state => state.theme);
  const availableStacks = stacks.filter(s => s.id !== currentStackId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`rounded-2xl p-4 w-full max-w-xs ${
          theme === 'dark'
            ? 'bg-slate-900/95 border border-white/10'
            : 'bg-white border border-gray-200'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Move to Stack</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableStacks.length === 0 ? (
            <p className={`text-sm text-center py-4 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>No other stacks available</p>
          ) : (
            availableStacks.map(stack => (
              <button
                key={stack.id}
                onClick={() => {
                  onMove(cardId, stack.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0"
                  style={{ background: stack.cover }}
                />
                <span className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stack.name}</span>
              </button>
            ))
          )}
        </div>
        <button
          onClick={onClose}
          className={`mt-4 w-full py-2 text-sm transition-colors ${
            theme === 'dark' ? 'text-white/60 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};
