import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GoalCard, calculateProgress } from './GoalCard'
import type { GoalWithSteps } from '@/types/database.types'

describe('GoalCard', () => {
  const mockGoal: GoalWithSteps = {
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
  }

  describe('Progress Calculation', () => {
    it('should calculate 0% progress when no steps exist', () => {
      const progress = calculateProgress([])
      expect(progress).toBe(0)
    })

    it('should calculate 0% progress when no steps are completed', () => {
      const steps = [
        { completed: false },
        { completed: false },
        { completed: false },
      ]
      const progress = calculateProgress(steps)
      expect(progress).toBe(0)
    })

    it('should calculate 100% progress when all steps are completed', () => {
      const steps = [
        { completed: true },
        { completed: true },
        { completed: true },
      ]
      const progress = calculateProgress(steps)
      expect(progress).toBe(100)
    })

    it('should calculate 50% progress when half steps are completed', () => {
      const steps = [
        { completed: true },
        { completed: false },
      ]
      const progress = calculateProgress(steps)
      expect(progress).toBe(50)
    })

    it('should calculate 33% progress when 1 of 3 steps are completed', () => {
      const steps = [
        { completed: true },
        { completed: false },
        { completed: false },
      ]
      const progress = calculateProgress(steps)
      expect(progress).toBe(33)
    })

    it('should calculate 67% progress when 2 of 3 steps are completed', () => {
      const steps = [
        { completed: true },
        { completed: true },
        { completed: false },
      ]
      const progress = calculateProgress(steps)
      expect(progress).toBe(67)
    })

    it('should round progress to nearest integer', () => {
      const steps = [
        { completed: true },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
        { completed: false },
      ]
      const progress = calculateProgress(steps)
      expect(progress).toBe(14) // 1/7 = 14.28... rounds to 14
    })
  })

  describe('Expand/Collapse Functionality', () => {
    it('should render in collapsed state by default', () => {
      render(<GoalCard goal={mockGoal} />)

      // Should show title
      expect(screen.getByText('Learn TypeScript')).toBeInTheDocument()

      // Should show progress bar
      expect(screen.getByRole('progressbar')).toBeInTheDocument()

      // Should show chevron down icon (collapsed)
      expect(screen.getByRole('button', { name: /expand goal/i })).toBeInTheDocument()

      // Should NOT show steps in collapsed state
      expect(screen.queryByText('Complete tutorial')).not.toBeInTheDocument()
      expect(screen.queryByText('Build a project')).not.toBeInTheDocument()
    })

    it('should expand when clicked', () => {
      render(<GoalCard goal={mockGoal} />)

      const expandButton = screen.getByRole('button', { name: /expand goal/i })
      fireEvent.click(expandButton)

      // Should show steps
      expect(screen.getByText('Complete tutorial')).toBeInTheDocument()
      expect(screen.getByText('Build a project')).toBeInTheDocument()

      // Should show action buttons
      expect(screen.getByRole('button', { name: /add step/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    it('should collapse when clicked again', () => {
      render(<GoalCard goal={mockGoal} />)

      const expandButton = screen.getByRole('button', { name: /expand goal/i })
      
      // Expand
      fireEvent.click(expandButton)
      expect(screen.getByText('Complete tutorial')).toBeInTheDocument()

      // Collapse
      const collapseButton = screen.getByRole('button', { name: /collapse goal/i })
      fireEvent.click(collapseButton)
      
      expect(screen.queryByText('Complete tutorial')).not.toBeInTheDocument()
    })

    it('should update aria-expanded attribute', () => {
      render(<GoalCard goal={mockGoal} />)

      const button = screen.getByRole('button', { name: /expand goal/i })
      expect(button).toHaveAttribute('aria-expanded', 'false')

      fireEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe('Progress Display', () => {
    it('should display correct progress percentage', () => {
      render(<GoalCard goal={mockGoal} />)

      expect(screen.getByText('50% complete (1/2 steps)')).toBeInTheDocument()
    })

    it('should display progress bar with correct width', () => {
      render(<GoalCard goal={mockGoal} />)

      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '50')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    })

    it('should display 0% when no steps exist', () => {
      const goalWithNoSteps: GoalWithSteps = {
        ...mockGoal,
        steps: [],
        progress: 0,
      }

      render(<GoalCard goal={goalWithNoSteps} />)

      expect(screen.getByText('0% complete (0/0 steps)')).toBeInTheDocument()
    })

    it('should display 100% when all steps completed', () => {
      const goalAllComplete: GoalWithSteps = {
        ...mockGoal,
        steps: [
          { ...mockGoal.steps[0], completed: true },
          { ...mockGoal.steps[1], completed: true },
        ],
        progress: 100,
      }

      render(<GoalCard goal={goalAllComplete} />)

      expect(screen.getByText('100% complete (2/2 steps)')).toBeInTheDocument()
    })
  })

  describe('Empty Steps State', () => {
    it('should show message when goal has no steps', () => {
      const goalWithNoSteps: GoalWithSteps = {
        ...mockGoal,
        steps: [],
        progress: 0,
      }

      render(<GoalCard goal={goalWithNoSteps} />)

      // Expand the goal
      const expandButton = screen.getByRole('button', { name: /expand goal/i })
      fireEvent.click(expandButton)

      expect(screen.getByText('No steps yet. Add your first step!')).toBeInTheDocument()
    })
  })

  describe('Action Callbacks', () => {
    it('should call onEdit when edit button clicked', () => {
      const onEdit = vi.fn()
      render(<GoalCard goal={mockGoal} onEdit={onEdit} />)

      // Expand
      const expandButton = screen.getByRole('button', { name: /expand goal/i })
      fireEvent.click(expandButton)

      // Click edit
      const editButton = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(editButton)

      expect(onEdit).toHaveBeenCalledWith(mockGoal)
    })

    it('should call onDelete when delete button clicked', async () => {
      const onDelete = vi.fn().mockResolvedValue(undefined)
      render(<GoalCard goal={mockGoal} onDelete={onDelete} />)

      // Expand
      const expandButton = screen.getByRole('button', { name: /expand goal/i })
      fireEvent.click(expandButton)

      // Click delete
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)

      expect(onDelete).toHaveBeenCalledWith('goal-1')
    })

    it('should call onAddStep when add step button clicked', () => {
      const onAddStep = vi.fn()
      render(<GoalCard goal={mockGoal} onAddStep={onAddStep} />)

      // Expand
      const expandButton = screen.getByRole('button', { name: /expand goal/i })
      fireEvent.click(expandButton)

      // Click add step
      const addStepButton = screen.getByRole('button', { name: /add step/i })
      fireEvent.click(addStepButton)

      expect(onAddStep).toHaveBeenCalledWith('goal-1')
    })

    it('should call onToggleStep when step checkbox clicked', async () => {
      const onToggleStep = vi.fn().mockResolvedValue(undefined)
      render(<GoalCard goal={mockGoal} onToggleStep={onToggleStep} />)

      // Expand
      const expandButton = screen.getByRole('button', { name: /expand goal/i })
      fireEvent.click(expandButton)

      // Click checkbox
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[0])

      expect(onToggleStep).toHaveBeenCalled()
    })

    it('should call onDeleteStep when step delete button clicked', async () => {
      const onDeleteStep = vi.fn().mockResolvedValue(undefined)
      render(<GoalCard goal={mockGoal} onDeleteStep={onDeleteStep} />)

      // Expand
      const expandButton = screen.getByRole('button', { name: /expand goal/i })
      fireEvent.click(expandButton)

      // Click step delete button
      const deleteButtons = screen.getAllByRole('button', { name: /delete step/i })
      fireEvent.click(deleteButtons[0])

      expect(onDeleteStep).toHaveBeenCalled()
    })
  })

  describe('Step Form Display', () => {
    it('should show step form when isAddingStep is true', () => {
      const onCreateStep = vi.fn()
      const onCancelAddStep = vi.fn()

      render(
        <GoalCard
          goal={mockGoal}
          isAddingStep={true}
          onCreateStep={onCreateStep}
          onCancelAddStep={onCancelAddStep}
        />
      )

      // Expand
      const expandButton = screen.getByRole('button', { name: /expand goal/i })
      fireEvent.click(expandButton)

      // Should show step form
      expect(screen.getByPlaceholderText(/step title/i)).toBeInTheDocument()
    })

    it('should disable add step button when form is open', () => {
      render(<GoalCard goal={mockGoal} isAddingStep={true} />)

      // Expand
      const expandButton = screen.getByRole('button', { name: /expand goal/i })
      fireEvent.click(expandButton)

      const addStepButton = screen.getByRole('button', { name: /add step/i })
      expect(addStepButton).toBeDisabled()
    })
  })
})
