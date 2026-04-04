import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TodoClient } from './TodoClient'
import type { Todo } from '@/types/database.types'
import * as todoActions from '@/actions/todos'
import toast from 'react-hot-toast'

// Mock dependencies
vi.mock('@/actions/todos')
vi.mock('react-hot-toast')

// Mock window.location.reload
const mockReload = vi.fn()
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
})

describe('TodoClient', () => {
  const mockInProgressTodos: Todo[] = [
    {
      id: '1',
      user_id: 'user-1',
      title: 'Study for math exam',
      completed: false,
      tag: 'math',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      user_id: 'user-1',
      title: 'Write English essay',
      completed: false,
      tag: 'english',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ]

  const mockCompletedTodos: Todo[] = [
    {
      id: '3',
      user_id: 'user-1',
      title: 'Science homework',
      completed: true,
      tag: 'science',
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockReload.mockClear()
  })

  describe('32.1 Test todo creation', () => {
    it('should open create modal when Add Task button is clicked', () => {
      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      const addButton = screen.getByRole('button', { name: /add task/i })
      fireEvent.click(addButton)

      expect(screen.getByText('Create Task')).toBeInTheDocument()
    })

    it('should create a new todo successfully', async () => {
      vi.mocked(todoActions.createTodo).mockResolvedValue({ success: true })

      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      // Open modal
      const addButton = screen.getByRole('button', { name: /add task/i })
      fireEvent.click(addButton)

      // Fill form
      const titleInput = screen.getByPlaceholderText(/enter task title/i)
      fireEvent.change(titleInput, { target: { value: 'New homework task' } })

      // Select tag
      const mathTag = screen.getByRole('button', { name: /math/i })
      fireEvent.click(mathTag)

      // Submit form
      const createButton = screen.getByRole('button', { name: /^create$/i })
      fireEvent.click(createButton)

      await waitFor(() => {
        expect(todoActions.createTodo).toHaveBeenCalledWith({
          title: 'New homework task',
          tag: 'math',
        })
      })

      expect(toast.success).toHaveBeenCalledWith('Task created successfully')
      expect(mockReload).toHaveBeenCalled()
    })

    it('should show error toast when creation fails', async () => {
      vi.mocked(todoActions.createTodo).mockResolvedValue({
        error: 'Failed to create todo',
      })

      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      // Open modal
      const addButton = screen.getByRole('button', { name: /add task/i })
      fireEvent.click(addButton)

      // Fill and submit form
      const titleInput = screen.getByPlaceholderText(/enter task title/i)
      fireEvent.change(titleInput, { target: { value: 'New task' } })

      const createButton = screen.getByRole('button', { name: /^create$/i })
      fireEvent.click(createButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to create todo')
      })

      expect(mockReload).not.toHaveBeenCalled()
    })

    it('should validate required fields', async () => {
      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      // Open modal
      const addButton = screen.getByRole('button', { name: /add task/i })
      fireEvent.click(addButton)

      // Try to submit without filling title
      const createButton = screen.getByRole('button', { name: /^create$/i })
      fireEvent.click(createButton)

      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      })

      expect(todoActions.createTodo).not.toHaveBeenCalled()
    })
  })

  describe('32.2 Test todo editing', () => {
    it('should open edit modal when edit button is clicked', () => {
      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      const editButtons = screen.getAllByLabelText(/edit task/i)
      fireEvent.click(editButtons[0])

      expect(screen.getByText('Edit Task')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Study for math exam')).toBeInTheDocument()
    })

    it('should update todo successfully', async () => {
      vi.mocked(todoActions.updateTodo).mockResolvedValue({ success: true })

      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      // Open edit modal
      const editButtons = screen.getAllByLabelText(/edit task/i)
      fireEvent.click(editButtons[0])

      // Update title
      const titleInput = screen.getByDisplayValue('Study for math exam')
      fireEvent.change(titleInput, { target: { value: 'Study for math final exam' } })

      // Submit form
      const updateButton = screen.getByRole('button', { name: /^update$/i })
      fireEvent.click(updateButton)

      await waitFor(() => {
        expect(todoActions.updateTodo).toHaveBeenCalledWith('1', {
          title: 'Study for math final exam',
          tag: 'math',
        })
      })

      expect(toast.success).toHaveBeenCalledWith('Task updated successfully')
      expect(mockReload).toHaveBeenCalled()
    })

    it('should show error toast when update fails', async () => {
      vi.mocked(todoActions.updateTodo).mockResolvedValue({
        error: 'Failed to update todo',
      })

      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      // Open edit modal
      const editButtons = screen.getAllByLabelText(/edit task/i)
      fireEvent.click(editButtons[0])

      // Submit form
      const updateButton = screen.getByRole('button', { name: /^update$/i })
      fireEvent.click(updateButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update todo')
      })

      expect(mockReload).not.toHaveBeenCalled()
    })
  })

  describe('32.3 Test todo deletion', () => {
    it('should delete todo after confirmation', async () => {
      vi.mocked(todoActions.deleteTodo).mockResolvedValue({ success: true })
      window.confirm = vi.fn(() => true)

      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      const deleteButtons = screen.getAllByLabelText(/delete task/i)
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(todoActions.deleteTodo).toHaveBeenCalledWith('1')
      })

      expect(toast.success).toHaveBeenCalledWith('Task deleted successfully')
      expect(mockReload).toHaveBeenCalled()
    })

    it('should not delete todo if confirmation is cancelled', async () => {
      window.confirm = vi.fn(() => false)

      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      const deleteButtons = screen.getAllByLabelText(/delete task/i)
      fireEvent.click(deleteButtons[0])

      expect(todoActions.deleteTodo).not.toHaveBeenCalled()
      expect(mockReload).not.toHaveBeenCalled()
    })

    it('should show error toast when deletion fails', async () => {
      vi.mocked(todoActions.deleteTodo).mockResolvedValue({
        error: 'Failed to delete todo',
      })
      window.confirm = vi.fn(() => true)

      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      const deleteButtons = screen.getAllByLabelText(/delete task/i)
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to delete todo')
      })
    })
  })

  describe('32.4 Test checkbox toggle with optimistic update', () => {
    it('should toggle todo completion status', async () => {
      vi.mocked(todoActions.toggleTodo).mockResolvedValue({ success: true })

      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      const checkboxes = screen.getAllByRole('checkbox')
      const firstCheckbox = checkboxes[0] as HTMLInputElement

      expect(firstCheckbox.checked).toBe(false)

      fireEvent.click(firstCheckbox)

      await waitFor(() => {
        expect(todoActions.toggleTodo).toHaveBeenCalledWith('1', true)
      })

      expect(mockReload).toHaveBeenCalled()
    })

    it('should toggle completed todo back to incomplete', async () => {
      vi.mocked(todoActions.toggleTodo).mockResolvedValue({ success: true })

      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      // Find the completed todo checkbox
      const checkboxes = screen.getAllByRole('checkbox')
      const completedCheckbox = checkboxes.find(
        (cb) => (cb as HTMLInputElement).checked
      ) as HTMLInputElement

      expect(completedCheckbox.checked).toBe(true)

      fireEvent.click(completedCheckbox)

      await waitFor(() => {
        expect(todoActions.toggleTodo).toHaveBeenCalledWith('3', false)
      })

      expect(mockReload).toHaveBeenCalled()
    })

    it('should show error toast when toggle fails', async () => {
      vi.mocked(todoActions.toggleTodo).mockResolvedValue({
        error: 'Failed to toggle todo',
      })

      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[0])

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to toggle todo')
      })

      expect(mockReload).not.toHaveBeenCalled()
    })
  })

  describe('32.5 Test collapsible sections', () => {
    it('should display in progress and done sections', () => {
      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      expect(screen.getByText(/in progress \(2\)/i)).toBeInTheDocument()
      expect(screen.getByText(/done \(1\)/i)).toBeInTheDocument()
    })

    it('should collapse and expand done section', () => {
      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={mockCompletedTodos}
        />
      )

      // Initially expanded - should see completed todo
      expect(screen.getByText('Science homework')).toBeInTheDocument()

      // Click to collapse
      const doneHeader = screen.getByRole('button', { name: /done \(1\)/i })
      fireEvent.click(doneHeader)

      // Should show hidden items message
      expect(screen.getByText(/1 item hidden/i)).toBeInTheDocument()
      expect(screen.queryByText('Science homework')).not.toBeInTheDocument()

      // Click to expand again
      fireEvent.click(doneHeader)

      // Should see completed todo again
      expect(screen.getByText('Science homework')).toBeInTheDocument()
    })

    it('should show correct count when done section is collapsed', () => {
      const manyCompletedTodos: Todo[] = [
        ...mockCompletedTodos,
        {
          id: '4',
          user_id: 'user-1',
          title: 'Another completed task',
          completed: true,
          tag: 'general',
          created_at: '2024-01-04T00:00:00Z',
          updated_at: '2024-01-04T00:00:00Z',
        },
      ]

      render(
        <TodoClient
          inProgressTodos={mockInProgressTodos}
          completedTodos={manyCompletedTodos}
        />
      )

      // Collapse done section
      const doneHeader = screen.getByRole('button', { name: /done \(2\)/i })
      fireEvent.click(doneHeader)

      expect(screen.getByText(/2 items hidden/i)).toBeInTheDocument()
    })
  })

  describe('32.6 Test empty state', () => {
    it('should show empty state when no in progress todos', () => {
      render(
        <TodoClient inProgressTodos={[]} completedTodos={mockCompletedTodos} />
      )

      expect(screen.getByText(/no tasks in progress/i)).toBeInTheDocument()
    })

    it('should show empty state when no completed todos', () => {
      render(
        <TodoClient inProgressTodos={mockInProgressTodos} completedTodos={[]} />
      )

      expect(screen.getByText(/no completed tasks/i)).toBeInTheDocument()
    })

    it('should show both empty states when no todos at all', () => {
      render(<TodoClient inProgressTodos={[]} completedTodos={[]} />)

      expect(screen.getByText(/no tasks in progress/i)).toBeInTheDocument()
      expect(screen.getByText(/no completed tasks/i)).toBeInTheDocument()
    })
  })
})
