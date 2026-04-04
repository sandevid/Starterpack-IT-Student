import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GoalClient } from './GoalClient'
import type { GoalWithSteps } from '@/types/database.types'
import * as goalActions from '@/actions/goals'
import toast from 'react-hot-toast'

// Mock actions
vi.mock('@/actions/goals', () => ({
  createGoal: vi.fn(),
  updateGoal: vi.fn(),
  deleteGoal: vi.fn(),
  createGoalStep: vi.fn(),
  toggleGoalStep: vi.fn(),
  deleteGoalStep: vi.fn(),
}))

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock window.location.reload
const mockReload = vi.fn()
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
})

describe('GoalClient', () => {
  const mockGoals: GoalWithSteps[] = [
    {
      id: 'goal-1',
      user_id: 'user-123',
      title: 'Learn TypeScript',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      steps: [
        {
          id: 'step-1',
          goal_id: 'goal-1',
          title: 'Complete tutorial',
          completed: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'step-2',
          goal_id: 'goal-1',
          title: 'Build a project',
          completed: false,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
      progress: 50,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockReload.mockClear()
  })

  describe('Empty State', () => {
    it('should display empty state when no goals exist', () => {
      render(<GoalClient goals={[]} />)

      expect(screen.getByText('No goals yet')).toBeInTheDocument()
      expect(screen.getByText('Set your first goal and break it down into achievable steps')).toBeInTheDocument()
    })

    it('should show create button in empty state', () => {
      render(<GoalClient goals={[]} />)

      const createButton = screen.getByRole('button', { name: /create goal/i })
      expect(createButton).toBeInTheDocument()
    })

    it('should open modal when clicking create button in empty state', () => {
      render(<GoalClient goals={[]} />)

      const createButton = screen.getByRole('button', { name: /create goal/i })
      fireEvent.click(createButton)

      expect(screen.getByText('Create Goal')).toBeInTheDocument()
    })
  })

  describe('Goal Creation', () => {
    it('should create a goal successfully', async () => {
      vi.mocked(goalActions.createGoal).mockResolvedValue({ success: true })

      render(<GoalClient goals={[]} />)

      // Open modal
      const addButton = screen.getByRole('button', { name: /add goal/i })
      fireEvent.click(addButton)

      // Fill form
      const titleInput = screen.getByLabelText(/title/i)
      fireEvent.change(titleInput, { target: { value: 'New Goal' } })

      // Submit
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(goalActions.createGoal).toHaveBeenCalledWith({ title: 'New Goal' })
        expect(toast.success).toHaveBeenCalledWith('Goal created successfully')
        expect(mockReload).toHaveBeenCalled()
      })
    })

    it('should show error toast when creation fails', async () => {
      vi.mocked(goalActions.createGoal).mockResolvedValue({ error: 'Failed to create goal' })

      render(<GoalClient goals={[]} />)

      // Open modal
      const addButton = screen.getByRole('button', { name: /add goal/i })
      fireEvent.click(addButton)

      // Fill form
      const titleInput = screen.getByLabelText(/title/i)
      fireEvent.change(titleInput, { target: { value: 'New Goal' } })

      // Submit
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to create goal')
        expect(mockReload).not.toHaveBeenCalled()
      })
    })
  })

  describe('Goal Editing', () => {
    it('should update a goal successfully', async () => {
      vi.mocked(goalActions.updateGoal).mockResolvedValue({ success: true })

      render(<GoalClient goals={mockGoals} />)

      // Expand goal
      const goalButton = screen.getByRole('button', { name: /expand goal: learn typescript/i })
      fireEvent.click(goalButton)

      // Click edit
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      // Update title
      const titleInput = screen.getByLabelText(/title/i)
      fireEvent.change(titleInput, { target: { value: 'Updated Goal' } })

      // Submit
      const submitButton = screen.getByRole('button', { name: /update/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(goalActions.updateGoal).toHaveBeenCalledWith('goal-1', { title: 'Updated Goal' })
        expect(toast.success).toHaveBeenCalledWith('Goal updated successfully')
        expect(mockReload).toHaveBeenCalled()
      })
    })

    it('should show error toast when update fails', async () => {
      vi.mocked(goalActions.updateGoal).mockResolvedValue({ error: 'Failed to update goal' })

      render(<GoalClient goals={mockGoals} />)

      // Expand goal
      const goalButton = screen.getByRole('button', { name: /expand goal: learn typescript/i })
      fireEvent.click(goalButton)

      // Click edit
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      // Update title
      const titleInput = screen.getByLabelText(/title/i)
      fireEvent.change(titleInput, { target: { value: 'Updated Goal' } })

      // Submit
      const submitButton = screen.getByRole('button', { name: /update/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update goal')
        expect(mockReload).not.toHaveBeenCalled()
      })
    })
  })

  describe('Goal Deletion', () => {
    it('should delete a goal successfully', async () => {
      vi.mocked(goalActions.deleteGoal).mockResolvedValue({ success: true })

      render(<GoalClient goals={mockGoals} />)

      // Expand goal
      const goalButton = screen.getByRole('button', { name: /expand goal: learn typescript/i })
      fireEvent.click(goalButton)

      // Click delete
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)

      await waitFor(() => {
        expect(goalActions.deleteGoal).toHaveBeenCalledWith('goal-1')
        expect(toast.success).toHaveBeenCalledWith('Goal deleted successfully')
        expect(mockReload).toHaveBeenCalled()
      })
    })

    it('should show error toast when deletion fails', async () => {
      vi.mocked(goalActions.deleteGoal).mockResolvedValue({ error: 'Failed to delete goal' })

      render(<GoalClient goals={mockGoals} />)

      // Expand goal
      const goalButton = screen.getByRole('button', { name: /expand goal: learn typescript/i })
      fireEvent.click(goalButton)

      // Click delete
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to delete goal')
        expect(mockReload).not.toHaveBeenCalled()
      })
    })
  })

  describe('Step Creation', () => {
    it('should create a step successfully', async () => {
      vi.mocked(goalActions.createGoalStep).mockResolvedValue({ success: true })

      render(<GoalClient goals={mockGoals} />)

      // Expand goal
      const goalButton = screen.getByRole('button', { name: /expand goal: learn typescript/i })
      fireEvent.click(goalButton)

      // Click add step
      const addStepButton = screen.getByRole('button', { name: /add step/i })
      fireEvent.click(addStepButton)

      // Fill step form
      const stepInput = screen.getByPlaceholderText(/step title/i)
      fireEvent.change(stepInput, { target: { value: 'New step' } })

      // Submit
      const submitButton = screen.getByRole('button', { name: /add/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(goalActions.createGoalStep).toHaveBeenCalledWith({
          title: 'New step',
          goal_id: 'goal-1',
        })
        expect(toast.success).toHaveBeenCalledWith('Step added successfully')
        expect(mockReload).toHaveBeenCalled()
      })
    })

    it('should show error toast when step creation fails', async () => {
      vi.mocked(goalActions.createGoalStep).mockResolvedValue({ error: 'Failed to create step' })

      render(<GoalClient goals={mockGoals} />)

      // Expand goal
      const goalButton = screen.getByRole('button', { name: /expand goal: learn typescript/i })
      fireEvent.click(goalButton)

      // Click add step
      const addStepButton = screen.getByRole('button', { name: /add step/i })
      fireEvent.click(addStepButton)

      // Fill step form
      const stepInput = screen.getByPlaceholderText(/step title/i)
      fireEvent.change(stepInput, { target: { value: 'New step' } })

      // Submit
      const submitButton = screen.getByRole('button', { name: /add/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to create step')
        expect(mockReload).not.toHaveBeenCalled()
      })
    })
  })

  describe('Step Toggle', () => {
    it('should toggle step completion status', async () => {
      vi.mocked(goalActions.toggleGoalStep).mockResolvedValue({ success: true })

      render(<GoalClient goals={mockGoals} />)

      // Expand goal
      const goalButton = screen.getByRole('button', { name: /expand goal: learn typescript/i })
      fireEvent.click(goalButton)

      // Find and click checkbox for incomplete step
      const checkboxes = screen.getAllByRole('checkbox')
      const incompleteCheckbox = checkboxes.find(cb => !cb.getAttribute('checked'))
      
      if (incompleteCheckbox) {
        fireEvent.click(incompleteCheckbox)

        await waitFor(() => {
          expect(goalActions.toggleGoalStep).toHaveBeenCalled()
          expect(mockReload).toHaveBeenCalled()
        })
      }
    })

    it('should show error toast when toggle fails', async () => {
      vi.mocked(goalActions.toggleGoalStep).mockResolvedValue({ error: 'Failed to toggle step' })

      render(<GoalClient goals={mockGoals} />)

      // Expand goal
      const goalButton = screen.getByRole('button', { name: /expand goal: learn typescript/i })
      fireEvent.click(goalButton)

      // Find and click checkbox
      const checkboxes = screen.getAllByRole('checkbox')
      if (checkboxes[0]) {
        fireEvent.click(checkboxes[0])

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith('Failed to toggle step')
          expect(mockReload).not.toHaveBeenCalled()
        })
      }
    })
  })

  describe('Step Deletion', () => {
    it('should delete a step successfully', async () => {
      vi.mocked(goalActions.deleteGoalStep).mockResolvedValue({ success: true })

      render(<GoalClient goals={mockGoals} />)

      // Expand goal
      const goalButton = screen.getByRole('button', { name: /expand goal: learn typescript/i })
      fireEvent.click(goalButton)

      // Find and click delete button for a step
      const deleteButtons = screen.getAllByRole('button', { name: /delete step/i })
      if (deleteButtons[0]) {
        fireEvent.click(deleteButtons[0])

        await waitFor(() => {
          expect(goalActions.deleteGoalStep).toHaveBeenCalled()
          expect(toast.success).toHaveBeenCalledWith('Step deleted successfully')
          expect(mockReload).toHaveBeenCalled()
        })
      }
    })

    it('should show error toast when step deletion fails', async () => {
      vi.mocked(goalActions.deleteGoalStep).mockResolvedValue({ error: 'Failed to delete step' })

      render(<GoalClient goals={mockGoals} />)

      // Expand goal
      const goalButton = screen.getByRole('button', { name: /expand goal: learn typescript/i })
      fireEvent.click(goalButton)

      // Find and click delete button for a step
      const deleteButtons = screen.getAllByRole('button', { name: /delete step/i })
      if (deleteButtons[0]) {
        fireEvent.click(deleteButtons[0])

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith('Failed to delete step')
          expect(mockReload).not.toHaveBeenCalled()
        })
      }
    })
  })
})
