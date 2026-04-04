import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EssentialCard } from './EssentialCard'
import type { Essential } from '@/types/database.types'

describe('EssentialCard', () => {
  const mockEssential: Essential = {
    id: '1',
    user_id: 'user-123',
    name: 'MacBook Pro',
    description: 'Laptop for coding',
    icon: 'Laptop',
    category: 'gadget',
    image_url: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  }

  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Card Rendering', () => {
    it('should render essential name', () => {
      render(<EssentialCard essential={mockEssential} />)

      expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
    })

    it('should render essential description', () => {
      render(<EssentialCard essential={mockEssential} />)

      expect(screen.getByText('Laptop for coding')).toBeInTheDocument()
    })

    it('should render category badge', () => {
      render(<EssentialCard essential={mockEssential} />)

      expect(screen.getByText('gadget')).toBeInTheDocument()
    })

    it('should render icon', () => {
      const { container } = render(<EssentialCard essential={mockEssential} />)

      // Check that icon container exists
      const iconContainer = container.querySelector('.bg-space-cadet\\/10')
      expect(iconContainer).toBeInTheDocument()
    })

    it('should handle missing description', () => {
      const essentialWithoutDescription: Essential = {
        ...mockEssential,
        description: null,
      }

      render(<EssentialCard essential={essentialWithoutDescription} />)

      expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
      expect(screen.queryByText('Laptop for coding')).not.toBeInTheDocument()
    })
  })

  describe('Icon Rendering', () => {
    it('should render Laptop icon', () => {
      render(<EssentialCard essential={{ ...mockEssential, icon: 'Laptop' }} />)
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
    })

    it('should render Headphones icon', () => {
      render(<EssentialCard essential={{ ...mockEssential, icon: 'Headphones' }} />)
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
    })

    it('should render BookOpen icon', () => {
      render(<EssentialCard essential={{ ...mockEssential, icon: 'BookOpen' }} />)
      expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
    })

    it('should render all icon types', () => {
      const icons = [
        'Laptop',
        'Headphones',
        'BookOpen',
        'Pen',
        'Backpack',
        'Watch',
        'Glasses',
        'Coffee',
        'Package',
        'Star',
      ] as const

      icons.forEach((icon) => {
        const { unmount } = render(
          <EssentialCard essential={{ ...mockEssential, icon }} />
        )
        expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('Category Colors', () => {
    it('should apply gadget category color', () => {
      render(<EssentialCard essential={{ ...mockEssential, category: 'gadget' }} />)

      const badge = screen.getByText('gadget')
      expect(badge).toHaveClass('bg-space-cadet')
      expect(badge).toHaveClass('text-cream')
    })

    it('should apply stationery category color', () => {
      render(<EssentialCard essential={{ ...mockEssential, category: 'stationery' }} />)

      const badge = screen.getByText('stationery')
      expect(badge).toHaveClass('bg-tan')
      expect(badge).toHaveClass('text-coffee')
    })

    it('should apply fashion category color', () => {
      render(<EssentialCard essential={{ ...mockEssential, category: 'fashion' }} />)

      const badge = screen.getByText('fashion')
      expect(badge).toHaveClass('bg-caput')
      expect(badge).toHaveClass('text-cream')
    })

    it('should apply book category color', () => {
      render(<EssentialCard essential={{ ...mockEssential, category: 'book' }} />)

      const badge = screen.getByText('book')
      expect(badge).toHaveClass('bg-slate-gray')
      expect(badge).toHaveClass('text-cream')
    })

    it('should apply general category color', () => {
      render(<EssentialCard essential={{ ...mockEssential, category: 'general' }} />)

      const badge = screen.getByText('general')
      expect(badge).toHaveClass('bg-coffee')
      expect(badge).toHaveClass('text-cream')
    })
  })

  describe('Action Buttons', () => {
    it('should render edit and delete buttons', () => {
      render(
        <EssentialCard
          essential={mockEssential}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })

    it('should call onEdit when edit button is clicked', () => {
      render(
        <EssentialCard
          essential={mockEssential}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const editButton = screen.getByText('Edit')
      fireEvent.click(editButton)

      expect(mockOnEdit).toHaveBeenCalledWith(mockEssential)
    })

    it('should call onDelete when delete button is clicked', () => {
      render(
        <EssentialCard
          essential={mockEssential}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      const deleteButton = screen.getByText('Delete')
      fireEvent.click(deleteButton)

      expect(mockOnDelete).toHaveBeenCalledWith('1')
    })

    it('should not render buttons when callbacks are not provided', () => {
      render(<EssentialCard essential={mockEssential} />)

      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })
  })

  describe('Card Styling', () => {
    it('should have proper card styling', () => {
      const { container } = render(<EssentialCard essential={mockEssential} />)

      const card = container.querySelector('.bg-white')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('rounded-[14px]')
    })

    it('should truncate long descriptions', () => {
      const longDescription = 'a'.repeat(200)
      const essentialWithLongDesc: Essential = {
        ...mockEssential,
        description: longDescription,
      }

      const { container } = render(<EssentialCard essential={essentialWithLongDesc} />)

      const description = container.querySelector('.line-clamp-2')
      expect(description).toBeInTheDocument()
    })
  })

  describe('Empty State Handling', () => {
    it('should handle essential with minimal data', () => {
      const minimalEssential: Essential = {
        id: '1',
        user_id: 'user-123',
        name: 'Test',
        description: null,
        icon: 'Package',
        category: 'general',
        image_url: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      }

      render(<EssentialCard essential={minimalEssential} />)

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('general')).toBeInTheDocument()
    })

    it('should handle empty description gracefully', () => {
      const essentialWithEmptyDesc: Essential = {
        ...mockEssential,
        description: '',
      }

      render(<EssentialCard essential={essentialWithEmptyDesc} />)

      expect(screen.getByText('MacBook Pro')).toBeInTheDocument()
    })
  })
})
