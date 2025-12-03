import { motion } from 'framer-motion'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  fullscreen?: boolean
}

export const Loading = ({ size = 'md', fullscreen = false }: LoadingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const containerClasses = fullscreen
    ? 'fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-[10000]'
    : 'flex items-center justify-center p-4'

  return (
    <div className={containerClasses}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-violet-500 border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
