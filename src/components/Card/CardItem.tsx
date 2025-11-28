import { motion } from 'framer-motion';
import type { Card as CardType, Stack } from '../../types';
import { Icons } from '../ui/Icons';
import { truncateText } from '../../utils';
import { useState } from 'react';

interface CardItemProps {
  card: CardType;
  index: number;
  onDelete?: (cardId: string) => void;
  onMove?: (cardId: string) => void;
  onEdit?: (cardId: string) => void;
}

export const CardItem = ({ card, index, onDelete, onMove, onEdit }: CardItemProps) => {
  const [imageError, setImageError] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10">
        {/* Card Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {!imageError ? (
            <img
              src={card.cover}
              alt={card.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
              <Icons.Image className="w-8 h-8 text-white/30" />
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showActions ? 1 : 0 }}
            className="absolute top-2 right-2 flex gap-2"
          >
            {onEdit && (
              <button
                onClick={() => onEdit(card.id)}
                className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-all"
                title="Edit card"
              >
                <Icons.Edit size={16} />
              </button>
            )}
            {onMove && (
              <button
                onClick={() => onMove(card.id)}
                className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-all"
                title="Move to another stack"
              >
                <Icons.Move size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(card.id)}
                className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-red-400 hover:bg-black/70 transition-all"
                title="Delete card"
              >
                <Icons.Trash size={16} />
              </button>
            )}
          </motion.div>
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">
            {card.name}
          </h3>
          {card.description && (
            <p className="text-white/60 text-xs line-clamp-2">
              {truncateText(card.description, 80)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Move Card Modal
interface MoveCardModalProps {
  cardId: string;
  currentStackId: string;
  stacks: Stack[];
  onMove: (cardId: string, toStackId: string) => void;
  onClose: () => void;
}

export const MoveCardModal = ({ cardId, currentStackId, stacks, onMove, onClose }: MoveCardModalProps) => {
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
        className="bg-slate-900/95 border border-white/10 rounded-2xl p-4 w-full max-w-xs"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-white font-semibold mb-3">Move to Stack</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableStacks.length === 0 ? (
            <p className="text-white/50 text-sm text-center py-4">No other stacks available</p>
          ) : (
            availableStacks.map(stack => (
              <button
                key={stack.id}
                onClick={() => {
                  onMove(cardId, stack.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left"
              >
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0"
                  style={{ background: stack.cover }}
                />
                <span className="text-white text-sm font-medium truncate">{stack.name}</span>
              </button>
            ))
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-white/60 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};
