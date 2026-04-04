import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { IconSelector } from './IconSelector'
import type { EssentialIcon } from '@/types/database.types'

describe('IconSelector', () => {
  const mockOnChange = vi.fn()

  const allIcons: EssentialIcon[] = [
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
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all 10 icon options', () => {
    render(<IconSelector value="Laptop" onChange={mockOnChange} />)

    // Check that all icon buttons are rendered
    allIcons.forEach((iconName) => {
      const button = screen.getByLabelText(iconName)
      expect(button).toBeInTheDocument()
    })
  })

  it('should highlight the selected icon', () => {
    render(<IconSelector value="Laptop" onChange={mockOnChange} />)

    const laptopButton = screen.getByLabelText('Laptop')
    expect(laptopButton).toHaveClass('border-space-cadet')
    expect(laptopButton).toHaveClass('bg-space-cadet/10')
  })

  it('should not highlight unselected icons', () => {
    render(<IconSelector value="Laptop" onChange={mockOnChange} />)

    const headphonesButton = screen.getByLabelText('Headphones')
    expect(headphonesButton).not.toHaveClass('border-space-cadet')
    expect(headphonesButton).toHaveClass('border-slate-gray/20')
  })

  it('should call onChange when an icon is clicked', () => {
    render(<IconSelector value="Laptop" onChange={mockOnChange} />)

    const headphonesButton = screen.getByLabelText('Headphones')
    fireEvent.click(headphonesButton)

    expect(mockOnChange).toHaveBeenCalledWith('Headphones')
  })

  it('should allow selecting different icons', () => {
    const { rerender } = render(<IconSelector value="Laptop" onChange={mockOnChange} />)

    // Click on Pen icon
    const penButton = screen.getByLabelText('Pen')
    fireEvent.click(penButton)
    expect(mockOnChange).toHaveBeenCalledWith('Pen')

    // Rerender with new value
    rerender(<IconSelector value="Pen" onChange={mockOnChange} />)

    // Pen should now be highlighted
    expect(penButton).toHaveClass('border-space-cadet')
  })

  it('should display icons in a grid layout', () => {
    const { container } = render(<IconSelector value="Laptop" onChange={mockOnChange} />)

    const grid = container.querySelector('.grid')
    expect(grid).toHaveClass('grid-cols-5')
  })

  it('should render all icon types correctly', () => {
    allIcons.forEach((icon) => {
      const { rerender } = render(<IconSelector value={icon} onChange={mockOnChange} />)

      const button = screen.getByLabelText(icon)
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('border-space-cadet')

      rerender(<></>)
    })
  })

  it('should have proper accessibility attributes', () => {
    render(<IconSelector value="Laptop" onChange={mockOnChange} />)

    allIcons.forEach((iconName) => {
      const button = screen.getByLabelText(iconName)
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveAttribute('aria-label', iconName)
    })
  })

  it('should maintain aspect ratio for icon buttons', () => {
    const { container } = render(<IconSelector value="Laptop" onChange={mockOnChange} />)

    const buttons = container.querySelectorAll('button')
    buttons.forEach((button) => {
      expect(button).toHaveClass('aspect-square')
    })
  })
})
