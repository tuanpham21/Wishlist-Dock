import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dock } from './Dock'
import { useWishlistStore } from '../../store/wishlistStore'

describe('Dock Component', () => {
  beforeEach(() => {
    // Reset store
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
  })

  it('should render floating action button when closed', () => {
    render(<Dock />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should show card count badge when cards exist', async () => {
    render(<Dock />)

    // Wait for component to initialize, then set cards
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    // Now set the cards after initialization
    useWishlistStore.setState({
      cards: [
        { id: '1', name: 'Card 1', stackId: 's1', description: '', cover: '', createdAt: 0, updatedAt: 0 },
        { id: '2', name: 'Card 2', stackId: 's1', description: '', cover: '', createdAt: 0, updatedAt: 0 },
      ],
    })

    // Wait for the badge to update
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  it('should show 99+ when more than 99 cards', async () => {
    render(<Dock />)

    // Wait for component to initialize
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    const cards = Array.from({ length: 105 }, (_, i) => ({
      id: `${i}`,
      name: `Card ${i}`,
      stackId: 's1',
      description: '',
      cover: '',
      createdAt: 0,
      updatedAt: 0,
    }))

    useWishlistStore.setState({ cards })

    // Wait for the badge to update
    await waitFor(() => {
      expect(screen.getByText('99+')).toBeInTheDocument()
    })
  })

  it('should open dock when button is clicked', async () => {
    const user = userEvent.setup()
    render(<Dock />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(useWishlistStore.getState().isOpen).toBe(true)
  })

  it('should display error message when sync fails', () => {
    useWishlistStore.setState({
      isOpen: true,
      syncStatus: 'error',
      errorMessage: 'Network error occurred',
    })

    render(<Dock />)

    expect(screen.getByText('Network error occurred')).toBeInTheDocument()
  })

  it('should clear error when close button is clicked', async () => {
    const user = userEvent.setup()

    useWishlistStore.setState({
      isOpen: true,
      syncStatus: 'error',
      errorMessage: 'Test error',
    })

    render(<Dock />)

    const closeButton = screen.getByLabelText(/close error/i)
    await user.click(closeButton)

    expect(useWishlistStore.getState().errorMessage).toBe(null)
  })

  it('should apply correct theme classes', () => {
    useWishlistStore.setState({ isOpen: true, theme: 'dark' })

    const { container } = render(<Dock />)

    const panel = container.querySelector('.bg-slate-900\\/95')
    expect(panel).toBeInTheDocument()
  })

  it('should apply light theme when set', async () => {
    render(<Dock defaultTheme="light" />)

    // Open the dock to see the Wishlist text
    const button = screen.getByRole('button')
    await userEvent.click(button)

    // Check for light theme text
    await waitFor(() => {
      expect(screen.getByText('Wishlist')).toBeInTheDocument()
    })

    // Verify theme was set to light (defaultTheme prop)
    expect(useWishlistStore.getState().theme).toBe('light')
  })

  it('should close dock when backdrop is clicked on mobile', async () => {
    const user = userEvent.setup()

    useWishlistStore.setState({ isOpen: true })

    render(<Dock />)

    // Find backdrop (the black overlay on mobile)
    const backdrop = document.querySelector('.bg-black\\/50')
    expect(backdrop).toBeInTheDocument()

    if (backdrop) {
      await user.click(backdrop as HTMLElement)
      expect(useWishlistStore.getState().isOpen).toBe(false)
    }
  })

  it('should initialize theme from props', () => {
    render(<Dock defaultTheme="light" />)

    // Wait for effect to run
    waitFor(() => {
      expect(useWishlistStore.getState().theme).toBe('light')
    })
  })
})
