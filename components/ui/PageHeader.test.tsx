import { render, screen, fireEvent } from '@testing-library/react'
import { PageHeader } from './PageHeader'
import { describe, it, expect, vi } from 'vitest'

describe('PageHeader', () => {
  it('should render title', () => {
    render(<PageHeader title="Calendar" />)

    expect(screen.getByText('Calendar')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Calendar')
  })

  it('should render without action button when action is not provided', () => {
    render(<PageHeader title="Calendar" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render action button when action is provided', () => {
    const mockOnClick = vi.fn()

    render(
      <PageHeader
        title="Calendar"
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
      <PageHeader
        title="Calendar"
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

  it('should apply correct layout classes', () => {
    const { container } = render(<PageHeader title="Calendar" />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-between', 'mb-6')
  })

  it('should render title with correct styling', () => {
    render(<PageHeader title="Calendar" />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('text-2xl', 'font-playfair', 'text-space-cadet')
  })
})
