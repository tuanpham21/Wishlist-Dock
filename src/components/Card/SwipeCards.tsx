import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, type PanInfo } from 'framer-motion';
import type { Card as CardType } from '../../types';
import { Icons } from '../ui/Icons';
import { Button } from '../ui/Button';
import { useWishlistStore } from '../../store/wishlistStore';

interface SwipeCardProps {
  cards: CardType[];
  currentIndex: number;
  onSwipe: (direction: 'left' | 'right') => void;
  onExit: () => void;
}

export const SwipeCards = ({ cards, currentIndex, onSwipe, onExit }: SwipeCardProps) => {
  const theme = useWishlistStore(state => state.theme);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
          <Icons.Layers className={`w-10 h-10 ${theme === 'dark' ? 'text-white/30' : 'text-gray-400'}`} />
        </div>
        <p className={`mb-4 ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>No cards in this stack</p>
        <Button variant="secondary" onClick={onExit}>
          Go Back
        </Button>
      </div>
    );
  }
  
  // Show up to 3 cards stacked
  const visibleCards = cards.slice(currentIndex, currentIndex + 3);
  
  return (
    <div className="relative h-full flex flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
        <button
          onClick={onExit}
          className={`flex items-center gap-2 transition-colors ${
            theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Icons.ChevronLeft size={20} />
          <span className="text-sm">Back</span>
        </button>
        <div className={`text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
          {currentIndex + 1} / {cards.length}
        </div>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>
      
      {/* Card Stack */}
      <div className="flex-1 relative overflow-hidden p-4">
        <div className="relative h-full flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {visibleCards.reverse().map((card, index) => {
              const actualIndex = visibleCards.length - 1 - index;
              return (
                <SwipeableCard
                  key={card.id}
                  card={card}
                  index={actualIndex}
                  isTop={actualIndex === 0}
                  onSwipe={onSwipe}
                />
              );
            })}
          </AnimatePresence>
          
          {currentIndex >= cards.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <Icons.Bookmark className="w-10 h-10 text-white" />
              </div>
              <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>All caught up!</h3>
              <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>You've seen all cards in this stack</p>
              <Button onClick={onExit}>Back to Stack</Button>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Navigation hints */}
      {currentIndex < cards.length && (
        <div className="p-4 flex justify-center gap-8">
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Icons.ChevronLeft size={16} />
            <span>Swipe left</span>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <span>Swipe right</span>
            <Icons.ChevronRight size={16} />
          </div>
        </div>
      )}
    </div>
  );
};

interface SwipeableCardProps {
  card: CardType;
  index: number;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
}

const SwipeableCard = ({ card, index, isTop, onSwipe }: SwipeableCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  
  // Indicator opacity
  const leftIndicatorOpacity = useTransform(x, [-100, 0], [1, 0]);
  const rightIndicatorOpacity = useTransform(x, [0, 100], [0, 1]);
  
  const [imageError, setImageError] = useState(false);
  
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };
  
  // Stack offset
  const scale = 1 - index * 0.05;
  const yOffset = index * 10;
  
  return (
    <motion.div
      className="absolute w-full max-w-sm"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale,
        y: yOffset,
        zIndex: 10 - index,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale, opacity: 1 }}
      exit={{ 
        x: x.get() > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.3 }
      }}
    >
      <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-grab active:cursor-grabbing">
        {/* Swipe Indicators */}
        {isTop && (
          <>
            <motion.div
              className="absolute top-6 left-6 px-4 py-2 bg-red-500 rounded-xl text-white font-bold text-sm z-10 rotate-[-15deg]"
              style={{ opacity: leftIndicatorOpacity }}
            >
              SKIP
            </motion.div>
            <motion.div
              className="absolute top-6 right-6 px-4 py-2 bg-green-500 rounded-xl text-white font-bold text-sm z-10 rotate-[15deg]"
              style={{ opacity: rightIndicatorOpacity }}
            >
              SAVE
            </motion.div>
          </>
        )}
        
        {/* Card Image */}
        <div className="aspect-[4/5] relative overflow-hidden">
          {!imageError ? (
            <img
              src={card.cover}
              alt={card.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              draggable={false}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-500/30 to-purple-600/30 flex items-center justify-center">
              <Icons.Image className="w-16 h-16 text-white/30" />
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          {/* Card Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-white text-xl font-bold mb-2">{card.name}</h3>
            {card.description && (
              <p className="text-white/70 text-sm line-clamp-3">{card.description}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
