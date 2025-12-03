import { useEffect, useRef } from 'react'

/**
 * Hook to trap focus within a container (useful for modals)
 * Automatically focuses the first focusable element when mounted
 * Prevents Tab from escaping the container
 */
export const useFocusTrap = (isActive = true) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current

    // Get all focusable elements
    const getFocusableElements = () => {
      const selector =
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      return Array.from(container.querySelectorAll<HTMLElement>(selector))
    }

    // Focus first element on mount
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      // Small delay to ensure animation has started
      setTimeout(() => {
        focusableElements[0]?.focus()
      }, 100)
    }

    // Handle Tab key to trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      }
      // Tab
      else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive])

  return containerRef
}
