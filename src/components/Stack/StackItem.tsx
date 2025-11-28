import { motion } from 'framer-motion';
import type { Stack } from '../../types';
import { Icons } from '../ui/Icons';
import { useState } from 'react';

interface StackItemProps {
  stack: Stack;
  cardCount: number;
  index: number;
  onClick: () => void;
  onDelete?: (stackId: string) => void;
  onEdit?: (stackId: string) => void;
}

export const StackItem = ({ stack, cardCount, index, onClick, onDelete, onEdit }: StackItemProps) => {
  const [showActions, setShowActions] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(stack.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(stack.id);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10">
        {/* Cover */}
        <div
          className="aspect-[16/9] relative"
          style={{ background: stack.cover }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Card count badge */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            {cardCount} {cardCount === 1 ? 'card' : 'cards'}
          </div>
          
          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showActions ? 1 : 0 }}
            className="absolute top-3 left-3 flex gap-2"
          >
            {onEdit && (
              <button
                onClick={handleEdit}
                className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all"
                title="Edit stack"
              >
                <Icons.Edit size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-red-400 hover:bg-black/60 transition-all"
                title="Delete stack"
              >
                <Icons.Trash size={14} />
              </button>
            )}
          </motion.div>
          
          {/* Stack icon */}
          <div className="absolute bottom-3 left-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Icons.Layers size={20} className="text-white" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm truncate">
            {stack.name}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};
