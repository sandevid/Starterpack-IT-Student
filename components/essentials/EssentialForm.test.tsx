import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EssentialForm } from './EssentialForm'
import type { Essential } from '@/types/database.types'

describe('EssentialForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Description (Optional)')).toBeInTheDocument()
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByLabelText('Category')).toBeInTheDocument()
    })

    it('should render submit and cancel buttons', () => {
      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      expect(screen.getByText('Create')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('should show "Update" button when editing', () => {
      const initialData: Essential = {
        id: '1',
        user_id: 'user-123',
        name: 'MacBook Pro',
        description: 'Laptop',
        icon: 'Laptop',
        category: 'gadget',
        image_url: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      }

      render(
        <EssentialForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          initialData={initialData}
        />
      )

      expect(screen.getByText('Update')).toBeInTheDocument()
    })
  })

  describe('Category Validation', () => {
    it('should render all 5 category options', () => {
      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement

      expect(categorySelect).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Gadget' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Stationery' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Fashion' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Book' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'General' })).toBeInTheDocument()
    })

    it('should allow selecting different categories', () => {
      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement

      fireEvent.change(categorySelect, { target: { value: 'stationery' } })
      expect(categorySelect.value).toBe('stationery')

      fireEvent.change(categorySelect, { target: { value: 'fashion' } })
      expect(categorySelect.value).toBe('fashion')
    })

    it('should default to "general" category', () => {
      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement
      expect(categorySelect.value).toBe('general')
    })

    it('should preserve category when editing', () => {
      const initialData: Essential = {
        id: '1',
        user_id: 'user-123',
        name: 'Notebook',
        description: 'For notes',
        icon: 'BookOpen',
        category: 'stationery',
        image_url: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      }

      render(
        <EssentialForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          initialData={initialData}
        />
      )

      const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement
      expect(categorySelect.value).toBe('stationery')
    })
  })

  describe('Form Validation', () => {
    it('should require name field', async () => {
      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      const submitButton = screen.getByText('Create')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/name/i)).toBeInTheDocument()
      })

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should validate name length', async () => {
      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText('Name')
      fireEvent.change(nameInput, { target: { value: 'a'.repeat(101) } })

      const submitButton = screen.getByText('Create')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/too long/i)).toBeInTheDocument()
      })
    })

    it('should validate description length', async () => {
      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText('Name')
      const descriptionInput = screen.getByLabelText('Description (Optional)')

      fireEvent.change(nameInput, { target: { value: 'Valid Name' } })
      fireEvent.change(descriptionInput, { target: { value: 'a'.repeat(501) } })

      const submitButton = screen.getByText('Create')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/too long/i)).toBeInTheDocument()
      })
    })

    it('should submit valid form data', async () => {
      mockOnSubmit.mockResolvedValue(undefined)

      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText('Name')
      const descriptionInput = screen.getByLabelText('Description (Optional)')
      const categorySelect = screen.getByLabelText('Category')

      fireEvent.change(nameInput, { target: { value: 'MacBook Pro' } })
      fireEvent.change(descriptionInput, { target: { value: 'Laptop for coding' } })
      fireEvent.change(categorySelect, { target: { value: 'gadget' } })

      const submitButton = screen.getByText('Create')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
        const callArgs = mockOnSubmit.mock.calls[0][0]
        expect(callArgs.name).toBe('MacBook Pro')
        expect(callArgs.description).toBe('Laptop for coding')
        expect(callArgs.icon).toBe('Laptop')
        expect(callArgs.category).toBe('gadget')
      })
    })
  })

  describe('Icon Selection', () => {
    it('should default to Laptop icon', () => {
      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      const laptopButton = screen.getByLabelText('Laptop')
      expect(laptopButton).toHaveClass('border-space-cadet')
    })

    it('should allow changing icon selection', async () => {
      mockOnSubmit.mockResolvedValue(undefined)

      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      const headphonesButton = screen.getByLabelText('Headphones')
      fireEvent.click(headphonesButton)

      const nameInput = screen.getByLabelText('Name')
      fireEvent.change(nameInput, { target: { value: 'Test' } })

      const submitButton = screen.getByText('Create')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
        const callArgs = mockOnSubmit.mock.calls[0][0]
        expect(callArgs.icon).toBe('Headphones')
      })
    })
  })

  describe('Form Actions', () => {
    it('should call onCancel when cancel button is clicked', () => {
      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should disable buttons while submitting', async () => {
      mockOnSubmit.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

      render(<EssentialForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

      const nameInput = screen.getByLabelText('Name')
      fireEvent.change(nameInput, { target: { value: 'Test' } })

      const submitButton = screen.getByText('Create')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toBeDisabled()
        expect(screen.getByText('Cancel')).toBeDisabled()
      })
    })

    it('should populate form with initial data when editing', () => {
      const initialData: Essential = {
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

      render(
        <EssentialForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          initialData={initialData}
        />
      )

      const nameInput = screen.getByLabelText('Name') as HTMLInputElement
      const descriptionInput = screen.getByLabelText('Description (Optional)') as HTMLTextAreaElement
      const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement

      expect(nameInput.value).toBe('MacBook Pro')
      expect(descriptionInput.value).toBe('Laptop for coding')
      expect(categorySelect.value).toBe('gadget')
    })
  })
})
