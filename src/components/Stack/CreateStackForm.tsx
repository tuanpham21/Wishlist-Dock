import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Icons } from '../ui/Icons';
import { useWishlistStore } from '../../store/wishlistStore';

interface CreateStackFormProps {
  onClose: () => void;
}

export const CreateStackForm = ({ onClose }: CreateStackFormProps) => {
  const createStack = useWishlistStore(state => state.createStack);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Stack name is required');
      return;
    }
    
    setIsSubmitting(true);
    await createStack(name.trim());
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
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full sm:max-w-md bg-slate-900/95 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Create New Stack</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <Icons.X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Stack Name"
            placeholder="e.g., Reading List, Shopping, Recipes..."
            value={name}
            onChange={e => {
              setName(e.target.value);
              setError(null);
            }}
            error={error || undefined}
            autoFocus
          />
          
          <p className="text-xs text-white/40">
            A cover will be automatically generated for your stack
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
              leftIcon={<Icons.FolderPlus size={18} />}
            >
              Create
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
