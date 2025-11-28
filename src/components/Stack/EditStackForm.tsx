import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Icons } from '../ui/Icons';
import { useWishlistStore } from '../../store/wishlistStore';
import type { Stack } from '../../types';
import { generateCover } from '../../utils';

interface EditStackFormProps {
  stack: Stack;
  onClose: () => void;
}

export const EditStackForm = ({ stack, onClose }: EditStackFormProps) => {
  const updateStack = useWishlistStore(state => state.updateStack);
  const [name, setName] = useState(stack.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Stack name is required');
      return;
    }

    setIsSubmitting(true);

    await updateStack(stack.id, {
      name: name.trim(),
    });

    setIsSubmitting(false);
    onClose();
  };

  const handleRegenerateCover = async () => {
    const { cover, coverType } = generateCover();
    await updateStack(stack.id, { cover, coverType });
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
        className="w-full sm:max-w-sm bg-slate-900/95 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Edit Stack</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <Icons.X size={20} />
          </button>
        </div>

        {/* Preview Cover */}
        <div className="mb-4">
          <div
            className="w-full h-32 rounded-2xl relative overflow-hidden"
            style={{ background: stack.cover }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Icons.Layers size={20} className="text-white" />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRegenerateCover}
            className="mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Regenerate Cover
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Stack Name"
            placeholder="Enter stack name"
            value={name}
            onChange={e => {
              setName(e.target.value);
              setError('');
            }}
            error={error}
            autoFocus
          />

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
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
