import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from './Card'
import { describe, it, expect, vi } from 'vitest'

describe('Card', () => {
  it('should render children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    )

    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should apply default classes', () => {
    const { container } = render(
      <Card>
        <div>Card content</div>
      </Card>
    )

    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('bg-white', 'rounded-[14px]', 'p-4', 'shadow-sm')
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Card content</div>
      </Card>
    )

    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('custom-class')
    expect(card).toHaveClass('bg-white', 'rounded-[14px]', 'p-4', 'shadow-sm')
  })

  it('should call onClick when clicked', () => {
    const mockOnClick = vi.fn()

    render(
      <Card onClick={mockOnClick}>
        <div>Card content</div>
      </Card>
    )

    const card = screen.getByText('Card content').parentElement
    if (card) {
      fireEvent.click(card)
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    }
  })

  it('should not call onClick when not provided', () => {
    const { container } = render(
      <Card>
        <div>Card content</div>
      </Card>
    )

    const card = container.firstChild as HTMLElement
    expect(() => fireEvent.click(card)).not.toThrow()
  })

  it('should render multiple children', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Description</p>
        <button>Action</button>
      </Card>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })
})
