import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EssentialsGrid } from './EssentialsGrid'
import type { Essential } from '@/types/database.types'

describe('EssentialsGrid', () => {
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
    {
      id: '3',
      user_id: 'user-123',
      name: 'Headphones',
      description: 'Noise cancelling',
      icon: 'Headphones',
      category: 'gadget',
      image_url: null,
      created_at: '2024-01-03',
      updated_at: '2024-01-03',
    },
    {
      id: '4',
      user_id: 'user-123',
      name: 'Backpack',
      description: 'School bag',
      icon: 'Backpack',
      category: 'fashion',
      image_url: null,
      created_at: '2024-01-04',
      updated_at: '2024-01-04',
    },
  ]

  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('2-Column Grid Layout', () => {
    it('should render essentials in a 2-column grid', () => {
      const { container } = render(
        <EssentialsGrid
          essentials={mockEssentials}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveClass('grid-cols-2')
    })

    it('should have proper gap between grid items', () => {
      const { container } = render(
        <EssentialsGrid
          essentials={mockEssentials}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('gap-4')
    })

    it('should render all essentials in the grid', () => {
      render(
        <EssentialsGrid
          essentials={mockEssentials}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
      expect(screen.getByText('Notebook')).toBeInTheDocument()
      expect(screen.getByText('Headphones')).toBeInTheDocument()
      expect(screen.getByText('Backpack')).toBeInTheDocument()
    })

    it('should render correct number of cards', () => {
      const { container } = render(
        <EssentialsGrid
          essentials={mockEssentials}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const cards = container.querySelectorAll('.bg-white')
      expect(cards.length).toBe(mockEssentials.length)
    })

    it('should handle single essential', () => {
      render(
        <EssentialsGrid
          essentials={[mockEssentials[0]]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
    })

    it('should handle odd number of essentials', () => {
      render(
        <EssentialsGrid
          essentials={mockEssentials.slice(0, 3)}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
      expect(screen.getByText('Notebook')).toBeInTheDocument()
      expect(screen.getByText('Headphones')).toBeInTheDocument()
    })

    it('should handle empty essentials array', () => {
      const { container } = render(
        <EssentialsGrid essentials={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      expect(grid?.children.length).toBe(0)
    })
  })

  describe('Essential Card Interactions', () => {
    it('should call onEdit when edit button is clicked', () => {
      render(
        <EssentialsGrid
          essentials={mockEssentials}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const editButtons = screen.getAllByText('Edit')
      fireEvent.click(editButtons[0])

      expect(mockOnEdit).toHaveBeenCalledWith(mockEssentials[0])
    })

    it('should call onDelete when delete button is clicked', () => {
      render(
        <EssentialsGrid
          essentials={mockEssentials}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])

      expect(mockOnDelete).toHaveBeenCalledWith('1')
    })

    it('should display all essential details', () => {
      render(
        <EssentialsGrid
          essentials={mockEssentials}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      // Check names
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
      expect(screen.getByText('Notebook')).toBeInTheDocument()

      // Check descriptions
      expect(screen.getByText('Laptop for coding')).toBeInTheDocument()
      expect(screen.getByText('For taking notes')).toBeInTheDocument()

      // Check categories
      expect(screen.getAllByText('gadget').length).toBe(2)
      expect(screen.getByText('stationery')).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it('should maintain 2-column layout regardless of content', () => {
      const { container } = render(
        <EssentialsGrid
          essentials={mockEssentials}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-2')
    })

    it('should render cards with proper spacing', () => {
      const { container } = render(
        <EssentialsGrid
          essentials={mockEssentials}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const cards = container.querySelectorAll('.rounded-\\[14px\\]')
      expect(cards.length).toBeGreaterThan(0)
    })
  })
})
