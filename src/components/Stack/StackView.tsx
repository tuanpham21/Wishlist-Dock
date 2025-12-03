import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '../../store/wishlistStore';
import { CardItem } from '../Card/CardItem';
import { Button } from '../ui/Button';
import { Icons } from '../ui/Icons';
import { Loading } from '../ui/Loading';

// Lazy load heavy components
const SwipeCards = lazy(() => import('../Card/SwipeCards').then(m => ({ default: m.SwipeCards })));
const AddCardForm = lazy(() => import('../Card/AddCardForm').then(m => ({ default: m.AddCardForm })));
const EditCardForm = lazy(() => import('../Card/EditCardForm').then(m => ({ default: m.EditCardForm })));
const MoveCardModal = lazy(() => import('../Card/MoveCardModal').then(m => ({ default: m.MoveCardModal })));

export const StackView = () => {
  const {
    activeStackId,
    stacks,
    cards,
    isSwipeMode,
    currentSwipeIndex,
    setActiveStack,
    deleteCard,
    moveCard,
    enterSwipeMode,
    exitSwipeMode,
    nextCard,
    isAddingCard,
    setIsAddingCard,
    theme,
  } = useWishlistStore();
  
  const [movingCardId, setMovingCardId] = useState<string | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const activeStack = stacks.find(s => s.id === activeStackId);
  const stackCards = cards.filter(c => c.stackId === activeStackId);
  const editingCard = editingCardId ? cards.find(c => c.id === editingCardId) : null;
  
  if (!activeStack) return null;
  
  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      await deleteCard(cardId);
    }
  };
  
  const handleMoveCard = async (cardId: string, toStackId: string) => {
    await moveCard(cardId, toStackId);
    setMovingCardId(null);
  };
  
  // Swipe mode view
  if (isSwipeMode) {
    return (
      <Suspense fallback={<Loading fullscreen />}>
        <SwipeCards
          cards={stackCards}
          currentIndex={currentSwipeIndex}
          onSwipe={() => {
            // For now, just go to next card
            nextCard();
          }}
          onExit={exitSwipeMode}
        />
      </Suspense>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center gap-3 p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
        <button
          onClick={() => setActiveStack(null)}
          className={`p-2 rounded-full transition-colors ${
            theme === 'dark'
              ? 'hover:bg-white/10 text-white/70 hover:text-white'
              : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
          }`}
        >
          <Icons.ChevronLeft size={20} />
        </button>

        <div
          className="w-10 h-10 rounded-xl flex-shrink-0"
          style={{ background: activeStack.cover }}
        />

        <div className="flex-1 min-w-0">
          <h2 className={`font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{activeStack.name}</h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
            {stackCards.length} {stackCards.length === 1 ? 'card' : 'cards'}
          </p>
        </div>
        
        {stackCards.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={enterSwipeMode}
            leftIcon={<Icons.Swipe size={16} />}
          >
            Swipe
          </Button>
        )}
      </div>
      
      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {stackCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Icons.Bookmark className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-white/80 font-medium mb-2">No cards yet</h3>
            <p className="text-white/50 text-sm mb-6 max-w-xs">
              Start building your collection by adding your first card
            </p>
            <Button
              onClick={() => setIsAddingCard(true)}
              leftIcon={<Icons.Plus size={18} />}
            >
              Add First Card
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {stackCards.map((card, index) => (
                <CardItem
                  key={card.id}
                  card={card}
                  index={index}
                  onDelete={handleDeleteCard}
                  onMove={(cardId) => setMovingCardId(cardId)}
                  onEdit={(cardId) => setEditingCardId(cardId)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Add Card Button (Fixed) */}
      {stackCards.length > 0 && (
        <div className="p-4 border-t border-white/10">
          <Button
            className="w-full"
            onClick={() => setIsAddingCard(true)}
            leftIcon={<Icons.Plus size={18} />}
          >
            Add Card
          </Button>
        </div>
      )}
      
      {/* Move Card Modal */}
      <AnimatePresence>
        {movingCardId && (
          <Suspense fallback={<Loading fullscreen />}>
            <MoveCardModal
              cardId={movingCardId}
              currentStackId={activeStackId!}
              stacks={stacks}
              onMove={handleMoveCard}
              onClose={() => setMovingCardId(null)}
            />
          </Suspense>
        )}
      </AnimatePresence>
      
      {/* Add Card Form */}
      <AnimatePresence>
        {isAddingCard && activeStackId && (
          <Suspense fallback={<Loading fullscreen />}>
            <AddCardForm
              stackId={activeStackId}
              onClose={() => setIsAddingCard(false)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Edit Card Form */}
      <AnimatePresence>
        {editingCard && (
          <Suspense fallback={<Loading fullscreen />}>
            <EditCardForm
              card={editingCard}
              onClose={() => setEditingCardId(null)}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};
