import { motion } from 'framer-motion';
import type { Card as CardType } from '../../types';
import { Icons } from '../ui/Icons';
import { truncateText } from '../../utils';
import { useState } from 'react';
import { useWishlistStore } from '../../store/wishlistStore';

interface CardItemProps {
  card: CardType;
  index: number;
  onDelete?: (cardId: string) => void;
  onMove?: (cardId: string) => void;
  onEdit?: (cardId: string) => void;
}

export const CardItem = ({ card, index, onDelete, onMove, onEdit }: CardItemProps) => {
  const theme = useWishlistStore(state => state.theme);
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
      <div className={`relative overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-white/5 border border-white/10 hover:border-white/20 hover:shadow-violet-500/10'
          : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-gray-300/20'
      }`}>
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
          <h3 className={`font-semibold text-sm mb-1 line-clamp-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {card.name}
          </h3>
          {card.description && (
            <p className={`text-xs line-clamp-2 ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
              {truncateText(card.description, 80)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
