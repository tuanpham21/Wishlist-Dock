import { useEffect } from 'react'

interface KeyboardShortcutOptions {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
}

export const useKeyboardShortcut = (
  options: KeyboardShortcutOptions,
  callback: () => void,
  enabled = true
) => {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const {
        key,
        ctrlKey = false,
        metaKey = false,
        shiftKey = false,
        altKey = false,
      } = options

      // Check if all modifier keys match
      const modifiersMatch =
        event.ctrlKey === ctrlKey &&
        event.metaKey === metaKey &&
        event.shiftKey === shiftKey &&
        event.altKey === altKey

      // Check if the key matches (case-insensitive)
      const keyMatches = event.key.toLowerCase() === key.toLowerCase()

      if (modifiersMatch && keyMatches) {
        event.preventDefault()
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [options.key, options.ctrlKey, options.metaKey, options.shiftKey, options.altKey, callback, enabled])
}
