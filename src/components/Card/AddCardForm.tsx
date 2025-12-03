import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';
import { Icons } from '../ui/Icons';
import { useWishlistStore } from '../../store/wishlistStore';
import { generatePlaceholderImage, generateId } from '../../utils';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface AddCardFormProps {
  stackId: string;
  onClose: () => void;
}

export const AddCardForm = ({ stackId, onClose }: AddCardFormProps) => {
  const createCard = useWishlistStore(state => state.createCard);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; cover?: string }>({});

  // Focus trap for accessibility
  const modalRef = useFocusTrap(true);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: { name?: string; cover?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Use provided URL or generate a placeholder
    const cover = coverUrl.trim() || generatePlaceholderImage(generateId());
    
    await createCard({
      name: name.trim(),
      description: description.trim() || undefined,
      cover,
      stackId,
    });
    
    setIsSubmitting(false);
    onClose();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full sm:max-w-md bg-slate-900/95 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-card-title"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="add-card-title" className="text-xl font-semibold text-white">Add New Card</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <Icons.X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter card name"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
            autoFocus
          />
          
          <TextArea
            label="Description (optional)"
            placeholder="Add a brief description..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
          
          <Input
            label="Cover Image URL (optional)"
            placeholder="https://example.com/image.jpg"
            value={coverUrl}
            onChange={e => setCoverUrl(e.target.value)}
          />
          
          <p className="text-xs text-white/40">
            Leave empty to use a random placeholder image
          </p>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isSubmitting}
            >
              Add Card
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
