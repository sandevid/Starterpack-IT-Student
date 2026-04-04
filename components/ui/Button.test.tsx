import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'
import { describe, it, expect, vi } from 'vitest'

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const mockOnClick = vi.fn()

    render(<Button onClick={mockOnClick}>Click me</Button>)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('should have type="button" by default', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('should accept custom type', () => {
    render(<Button type="submit">Submit</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('should apply primary variant styles by default', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-space-cadet', 'text-cream')
  })

  it('should apply secondary variant styles', () => {
    render(<Button variant="secondary">Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-slate-gray', 'text-cream')
  })

  it('should apply danger variant styles', () => {
    render(<Button variant="danger">Delete</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-caput', 'text-cream')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not call onClick when disabled', () => {
    const mockOnClick = vi.fn()

    render(
      <Button onClick={mockOnClick} disabled>
        Click me
      </Button>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('should show loading state', () => {
    render(<Button loading>Click me</Button>)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Click me')).not.toBeInTheDocument()
  })

  it('should be disabled when loading', () => {
    render(<Button loading>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should not call onClick when loading', () => {
    const mockOnClick = vi.fn()

    render(
      <Button onClick={mockOnClick} loading>
        Click me
      </Button>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should apply base styles to all variants', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('px-6', 'py-3', 'rounded-[10px]', 'font-medium')
  })
})
