import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyState } from './EmptyState'
import { Calendar } from 'lucide-react'
import { describe, it, expect, vi } from 'vitest'

describe('EmptyState', () => {
  it('should render icon, title, and description', () => {
    render(
      <EmptyState
        icon={Calendar}
        title="No Events"
        description="You haven't added any events yet"
      />
    )

    expect(screen.getByText('No Events')).toBeInTheDocument()
    expect(screen.getByText("You haven't added any events yet")).toBeInTheDocument()
  })

  it('should render without action button when action is not provided', () => {
    render(
      <EmptyState
        icon={Calendar}
        title="No Events"
        description="You haven't added any events yet"
      />
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render action button when action is provided', () => {
    const mockOnClick = vi.fn()

    render(
      <EmptyState
        icon={Calendar}
        title="No Events"
        description="You haven't added any events yet"
        action={{
          label: 'Add Event',
          onClick: mockOnClick,
        }}
      />
    )

    const button = screen.getByRole('button', { name: 'Add Event' })
    expect(button).toBeInTheDocument()
  })

  it('should call action onClick when button is clicked', () => {
    const mockOnClick = vi.fn()

    render(
      <EmptyState
        icon={Calendar}
        title="No Events"
        description="You haven't added any events yet"
        action={{
          label: 'Add Event',
          onClick: mockOnClick,
        }}
      />
    )

    const button = screen.getByRole('button', { name: 'Add Event' })
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('should apply correct CSS classes', () => {
    const { container } = render(
      <EmptyState
        icon={Calendar}
        title="No Events"
        description="You haven't added any events yet"
      />
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
  })
})
