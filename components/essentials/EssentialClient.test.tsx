import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EssentialClient } from './EssentialClient'
import type { Essential } from '@/types/database.types'
import * as essentialsActions from '@/actions/essentials'
import toast from 'react-hot-toast'

vi.mock('@/actions/essentials')
vi.mock('react-hot-toast')

describe('EssentialClient', () => {
  const mockEssentials: Essential[] = [
    {
      id: '1',
      user_id: 'user-123',
      name: 'MacBook Pro',
      description: 'Laptop for coding',
      icon: 'Laptop',
      category: 'gadget',
      image_url: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '2',
      user_id: 'user-123',
      name: 'Notebook',
      description: 'For taking notes',
      icon: 'BookOpen',
      category: 'stationery',
      image_url: null,
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    delete (window as any).location
    ;(window as any).location = { reload: vi.fn() }
  })

  describe('Empty State', () => {
    it('should display empty state when no essentials exist', () => {
      render(<EssentialClient essentials={[]} />)

      expect(screen.getByText('No essentials yet')).toBeInTheDocument()
      expect(
        screen.getByText('Add recommended school products and items you need for your academic life')
      ).toBeInTheDocument()
    })

    it('should show add button in empty state', () => {
      render(<EssentialClient essentials={[]} />)

      const addButtons = screen.getAllByText('Add Essential')
      expect(addButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Essential Creation', () => {
    it('should open modal when add button is clicked', () => {
      render(<EssentialClient essentials={mockEssentials} />)

      const addButton = screen.getByText('Add Essential')
      fireEvent.click(addButton)

      expect(screen.getByRole('heading', { name: 'Add Essential' })).toBeInTheDocument()
    })

    it('should show form in modal', () => {
      render(<EssentialClient essentials={mockEssentials} />)

      const addButton = screen.getByText('Add Essential')
      fireEvent.click(addButton)

      // Form should be visible
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Category')).toBeInTheDocument()
    })
  })

  describe('Essential Editing', () => {
    it('should open edit modal when edit button is clicked', () => {
      render(<EssentialClient essentials={mockEssentials} />)

      const editButtons = screen.getAllByText('Edit')
      fireEvent.click(editButtons[0])

      expect(screen.getByRole('heading', { name: 'Edit Essential' })).toBeInTheDocument()
    })

    it('should populate form with essential data when editing', () => {
      render(<EssentialClient essentials={mockEssentials} />)

      const editButtons = screen.getAllByText('Edit')
      fireEvent.click(editButtons[0])

      const nameInput = screen.getByLabelText('Name') as HTMLInputElement
      expect(nameInput.value).toBe('MacBook Pro')
    })
  })

  describe('Essential Deletion', () => {
    it('should delete essential successfully', async () => {
      vi.mocked(essentialsActions.deleteEssential).mockResolvedValue({ success: true })

      render(<EssentialClient essentials={mockEssentials} />)

      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(essentialsActions.deleteEssential).toHaveBeenCalledWith('1')
        expect(toast.success).toHaveBeenCalledWith('Essential deleted successfully')
      })
    })

    it('should show error toast on deletion failure', async () => {
      vi.mocked(essentialsActions.deleteEssential).mockResolvedValue({
        error: 'Failed to delete essential',
      })

      render(<EssentialClient essentials={mockEssentials} />)

      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to delete essential')
      })
    })
  })

  describe('2-Column Grid Layout', () => {
    it('should display essentials in a grid', () => {
      render(<EssentialClient essentials={mockEssentials} />)

      expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
      expect(screen.getByText('Notebook')).toBeInTheDocument()
    })

    it('should display all essential details', () => {
      render(<EssentialClient essentials={mockEssentials} />)

      expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
      expect(screen.getByText('Laptop for coding')).toBeInTheDocument()
      expect(screen.getByText('gadget')).toBeInTheDocument()

      expect(screen.getByText('Notebook')).toBeInTheDocument()
      expect(screen.getByText('For taking notes')).toBeInTheDocument()
      expect(screen.getByText('stationery')).toBeInTheDocument()
    })
  })
})
