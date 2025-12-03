import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWishlistStore } from './wishlistStore'
import { api } from '../api'

// Mock the API
vi.mock('../api', () => ({
  api: {
    createStack: vi.fn(),
    deleteStack: vi.fn(),
    updateStack: vi.fn(),
    createCard: vi.fn(),
    deleteCard: vi.fn(),
    updateCard: vi.fn(),
    moveCard: vi.fn(),
  }
}))

describe('WishlistStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useWishlistStore.setState({
      stacks: [],
      cards: [],
      isOpen: false,
      activeStackId: null,
      isSwipeMode: false,
      currentSwipeIndex: 0,
      syncStatus: 'idle',
      errorMessage: null,
      theme: 'dark',
      isAddingCard: false,
      isCreatingStack: false,
    })

    // Clear all mocks
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('Dock Actions', () => {
    it('should toggle dock open/closed', () => {
      const { toggleDock } = useWishlistStore.getState()

      expect(useWishlistStore.getState().isOpen).toBe(false)

      toggleDock()
      expect(useWishlistStore.getState().isOpen).toBe(true)

      toggleDock()
      expect(useWishlistStore.getState().isOpen).toBe(false)
    })

    it('should open dock', () => {
      const { openDock } = useWishlistStore.getState()

      openDock()
      expect(useWishlistStore.getState().isOpen).toBe(true)
    })

    it('should close dock and reset state', () => {
      const { closeDock } = useWishlistStore.getState()

      // Set some state first
      useWishlistStore.setState({
        isOpen: true,
        activeStackId: 'test-stack',
        isSwipeMode: true,
      })

      closeDock()

      const state = useWishlistStore.getState()
      expect(state.isOpen).toBe(false)
      expect(state.activeStackId).toBe(null)
      expect(state.isSwipeMode).toBe(false)
    })

    it('should set theme', () => {
      const { setTheme } = useWishlistStore.getState()

      setTheme('light')
      expect(useWishlistStore.getState().theme).toBe('light')

      setTheme('dark')
      expect(useWishlistStore.getState().theme).toBe('dark')
    })
  })

  describe('Stack Actions - Optimistic Updates', () => {
    it('should create stack with optimistic update', async () => {
      vi.mocked(api.createStack).mockImplementation((stack) => Promise.resolve(stack))

      const { createStack } = useWishlistStore.getState()

      // Create stack
      const createPromise = createStack('Test Stack')

      // Should optimistically add the stack immediately
      let state = useWishlistStore.getState()
      expect(state.stacks).toHaveLength(1)
      expect(state.stacks[0].name).toBe('Test Stack')
      expect(state.syncStatus).toBe('syncing')

      // Wait for API call
      await createPromise

      // Should be in idle state after success
      state = useWishlistStore.getState()
      expect(state.syncStatus).toBe('idle')
      expect(state.stacks).toHaveLength(1)
      expect(api.createStack).toHaveBeenCalledTimes(1)
    })

    it('should rollback on create stack failure', async () => {
      vi.mocked(api.createStack).mockRejectedValue(new Error('Network error'))

      const { createStack } = useWishlistStore.getState()

      // Create stack
      const createPromise = createStack('Test Stack')

      // Should optimistically add the stack
      expect(useWishlistStore.getState().stacks).toHaveLength(1)

      // Wait for API call to fail
      await createPromise

      // Should rollback the stack creation
      const state = useWishlistStore.getState()
      expect(state.stacks).toHaveLength(0)
      expect(state.syncStatus).toBe('error')
      expect(state.errorMessage).toBe('Network error')
    })

    it('should delete stack with optimistic update', async () => {
      vi.mocked(api.deleteStack).mockResolvedValue(undefined)

      // Add a stack first
      const stackId = 'test-stack-id'
      useWishlistStore.setState({
        stacks: [{
          id: stackId,
          name: 'Test Stack',
          cover: 'test.jpg',
          coverType: 'image',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }],
      })

      const { deleteStack } = useWishlistStore.getState()

      // Delete stack
      const deletePromise = deleteStack(stackId)

      // Should optimistically remove the stack immediately
      let state = useWishlistStore.getState()
      expect(state.stacks).toHaveLength(0)
      expect(state.syncStatus).toBe('syncing')

      // Wait for API call
      await deletePromise

      // Should be in idle state after success
      state = useWishlistStore.getState()
      expect(state.syncStatus).toBe('idle')
      expect(state.stacks).toHaveLength(0)
    })

    it('should rollback on delete stack failure', async () => {
      vi.mocked(api.deleteStack).mockRejectedValue(new Error('Delete failed'))

      // Add a stack first
      const stackId = 'test-stack-id'
      const stack = {
        id: stackId,
        name: 'Test Stack',
        cover: 'test.jpg',
        coverType: 'image' as const,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      useWishlistStore.setState({ stacks: [stack] })

      const { deleteStack } = useWishlistStore.getState()

      // Delete stack
      const deletePromise = deleteStack(stackId)

      // Should optimistically remove the stack
      expect(useWishlistStore.getState().stacks).toHaveLength(0)

      // Wait for API call to fail
      await deletePromise

      // Should rollback the stack deletion
      const state = useWishlistStore.getState()
      expect(state.stacks).toHaveLength(1)
      expect(state.stacks[0].id).toBe(stackId)
      expect(state.syncStatus).toBe('error')
      expect(state.errorMessage).toBe('Delete failed')
    })
  })

  describe('Card Actions - Optimistic Updates', () => {
    it('should create card with optimistic update', async () => {
      vi.mocked(api.createCard).mockImplementation((card) => Promise.resolve(card))

      const { createCard } = useWishlistStore.getState()

      const cardData = {
        name: 'Test Card',
        description: 'Test description',
        cover: 'test.jpg',
        stackId: 'stack-1',
      }

      // Create card
      const createPromise = createCard(cardData)

      // Should optimistically add the card immediately
      let state = useWishlistStore.getState()
      expect(state.cards).toHaveLength(1)
      expect(state.cards[0].name).toBe('Test Card')
      expect(state.syncStatus).toBe('syncing')

      // Wait for API call
      await createPromise

      // Should be in idle state after success
      state = useWishlistStore.getState()
      expect(state.syncStatus).toBe('idle')
      expect(state.cards).toHaveLength(1)
    })

    it('should rollback on create card failure', async () => {
      vi.mocked(api.createCard).mockRejectedValue(new Error('Card creation failed'))

      const { createCard } = useWishlistStore.getState()

      const cardData = {
        name: 'Test Card',
        description: 'Test description',
        cover: 'test.jpg',
        stackId: 'stack-1',
      }

      // Create card
      const createPromise = createCard(cardData)

      // Should optimistically add the card
      expect(useWishlistStore.getState().cards).toHaveLength(1)

      // Wait for API call to fail
      await createPromise

      // Should rollback the card creation
      const state = useWishlistStore.getState()
      expect(state.cards).toHaveLength(0)
      expect(state.syncStatus).toBe('error')
      expect(state.errorMessage).toBe('Card creation failed')
    })
  })

  describe('Helper Functions', () => {
    it('should get cards for a specific stack', () => {
      const stackId = 'stack-1'
      useWishlistStore.setState({
        cards: [
          { id: '1', name: 'Card 1', stackId, description: '', cover: '', createdAt: 0, updatedAt: 0 },
          { id: '2', name: 'Card 2', stackId: 'stack-2', description: '', cover: '', createdAt: 0, updatedAt: 0 },
          { id: '3', name: 'Card 3', stackId, description: '', cover: '', createdAt: 0, updatedAt: 0 },
        ],
      })

      const { getStackCards } = useWishlistStore.getState()
      const stackCards = getStackCards(stackId)

      expect(stackCards).toHaveLength(2)
      expect(stackCards[0].id).toBe('1')
      expect(stackCards[1].id).toBe('3')
    })

    it('should get card count for a stack', () => {
      const stackId = 'stack-1'
      useWishlistStore.setState({
        cards: [
          { id: '1', name: 'Card 1', stackId, description: '', cover: '', createdAt: 0, updatedAt: 0 },
          { id: '2', name: 'Card 2', stackId: 'stack-2', description: '', cover: '', createdAt: 0, updatedAt: 0 },
          { id: '3', name: 'Card 3', stackId, description: '', cover: '', createdAt: 0, updatedAt: 0 },
        ],
      })

      const { getCardCount } = useWishlistStore.getState()
      const count = getCardCount(stackId)

      expect(count).toBe(2)
    })
  })

  describe('Swipe Mode', () => {
    it('should enter and exit swipe mode', () => {
      const { enterSwipeMode, exitSwipeMode } = useWishlistStore.getState()

      enterSwipeMode()
      expect(useWishlistStore.getState().isSwipeMode).toBe(true)

      exitSwipeMode()
      expect(useWishlistStore.getState().isSwipeMode).toBe(false)
    })

    it('should navigate through cards in swipe mode', () => {
      // Setup test data
      useWishlistStore.setState({
        activeStackId: 'stack1',
        cards: [
          { id: '1', name: 'Card 1', stackId: 'stack1', description: '', cover: '', createdAt: 0, updatedAt: 0 },
          { id: '2', name: 'Card 2', stackId: 'stack1', description: '', cover: '', createdAt: 0, updatedAt: 0 },
          { id: '3', name: 'Card 3', stackId: 'stack1', description: '', cover: '', createdAt: 0, updatedAt: 0 },
        ]
      });

      const { setSwipeIndex, nextCard, prevCard } = useWishlistStore.getState()

      setSwipeIndex(0)
      expect(useWishlistStore.getState().currentSwipeIndex).toBe(0)

      nextCard()
      expect(useWishlistStore.getState().currentSwipeIndex).toBe(1)

      prevCard()
      expect(useWishlistStore.getState().currentSwipeIndex).toBe(0)
    })
  })

  describe('Error Handling', () => {
    it('should clear error message', () => {
      const { clearError } = useWishlistStore.getState()

      useWishlistStore.setState({
        syncStatus: 'error',
        errorMessage: 'Test error',
      })

      clearError()

      const state = useWishlistStore.getState()
      expect(state.syncStatus).toBe('idle')
      expect(state.errorMessage).toBe(null)
    })
  })
})
