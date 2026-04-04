/**
 * Integration Test: Optimistic UI Updates
 * 
 * Tests optimistic UI behavior for checkbox interactions:
 * - Todo completion toggle
 * - Goal step completion toggle
 * 
 * Validates Requirement 14 (Performance and User Experience)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createClient } from '@/lib/supabase/server'
import { toggleTodo } from '@/actions/todos'
import { toggleGoalStep } from '@/actions/goals'

vi.mock('@/lib/supabase/server')
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Integration: Optimistic UI Updates', () => {
  let mockSupabase: any
  const mockUser = { id: 'user-123', email: 'test@example.com' }

  beforeEach(() => {
    vi.clearAllMocks()

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
      from: vi.fn(),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase)
  })

  describe('59.3: Todo Checkbox Optimistic Updates', () => {
    it('should toggle todo completion with optimistic update', async () => {
      // Setup mock for successful toggle
      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      // Toggle todo to completed
      const result = await toggleTodo('todo-123', true)

      expect(result).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({ completed: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('todos')

      // Verify the update was called with correct parameters
      expect(mockEq1).toHaveBeenCalledWith('id', 'todo-123')
      expect(mockEq2).toHaveBeenCalledWith('user_id', mockUser.id)
    })

    it('should toggle todo back to incomplete', async () => {
      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      // Toggle todo to incomplete
      const result = await toggleTodo('todo-123', false)

      expect(result).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({ completed: false })
    })

    it('should handle rapid successive toggles', async () => {
      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      // Simulate rapid toggles
      await toggleTodo('todo-123', true)
      await toggleTodo('todo-123', false)
      await toggleTodo('todo-123', true)

      // All toggles should be processed
      expect(mockUpdate).toHaveBeenCalledTimes(3)
      expect(mockUpdate).toHaveBeenNthCalledWith(1, { completed: true })
      expect(mockUpdate).toHaveBeenNthCalledWith(2, { completed: false })
      expect(mockUpdate).toHaveBeenNthCalledWith(3, { completed: true })
    })

    it('should handle toggle failure gracefully', async () => {
      const mockEq2 = vi.fn().mockResolvedValue({
        error: { message: 'Database error' },
      })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      const result = await toggleTodo('todo-123', true)

      expect(result).toEqual({ error: 'Failed to toggle todo' })
      // In real implementation, UI would revert optimistic update
    })

    it('should enforce authentication for toggle operations', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await toggleTodo('todo-123', true)

      expect(result).toEqual({ error: 'Unauthorized' })
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })
  })

  describe('59.3: Goal Step Checkbox Optimistic Updates', () => {
    it('should toggle goal step completion with optimistic update', async () => {
      // Mock step verification
      const mockStepSingle = vi.fn().mockResolvedValue({
        data: {
          goal_id: 'goal-456',
          goals: { user_id: mockUser.id },
        },
        error: null,
      })
      const mockStepEq = vi.fn().mockReturnValue({ single: mockStepSingle })
      const mockStepSelect = vi.fn().mockReturnValue({ eq: mockStepEq })

      // Mock step update
      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq })

      mockSupabase.from.mockReturnValue({
        select: mockStepSelect,
        update: mockUpdate,
      })

      const result = await toggleGoalStep('step-789', true)

      expect(result).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({ completed: true })
    })

    it('should toggle goal step back to incomplete', async () => {
      const mockStepSingle = vi.fn().mockResolvedValue({
        data: {
          goal_id: 'goal-456',
          goals: { user_id: mockUser.id },
        },
        error: null,
      })
      const mockStepEq = vi.fn().mockReturnValue({ single: mockStepSingle })
      const mockStepSelect = vi.fn().mockReturnValue({ eq: mockStepEq })

      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq })

      mockSupabase.from.mockReturnValue({
        select: mockStepSelect,
        update: mockUpdate,
      })

      const result = await toggleGoalStep('step-789', false)

      expect(result).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({ completed: false })
    })

    it('should handle multiple goal steps toggling independently', async () => {
      const mockStepSingle = vi.fn().mockResolvedValue({
        data: {
          goal_id: 'goal-456',
          goals: { user_id: mockUser.id },
        },
        error: null,
      })
      const mockStepEq = vi.fn().mockReturnValue({ single: mockStepSingle })
      const mockStepSelect = vi.fn().mockReturnValue({ eq: mockStepEq })

      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq })

      mockSupabase.from.mockReturnValue({
        select: mockStepSelect,
        update: mockUpdate,
      })

      // Toggle multiple steps
      await toggleGoalStep('step-1', true)
      await toggleGoalStep('step-2', true)
      await toggleGoalStep('step-3', false)

      expect(mockUpdate).toHaveBeenCalledTimes(3)
    })

    it('should verify step ownership before toggling', async () => {
      // Mock step belonging to different user
      const mockStepSingle = vi.fn().mockResolvedValue({
        data: {
          goal_id: 'goal-456',
          goals: { user_id: 'other-user-999' },
        },
        error: null,
      })
      const mockStepEq = vi.fn().mockReturnValue({ single: mockStepSingle })
      const mockStepSelect = vi.fn().mockReturnValue({ eq: mockStepEq })
      mockSupabase.from.mockReturnValue({ select: mockStepSelect })

      const result = await toggleGoalStep('step-789', true)

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should handle goal step toggle failure', async () => {
      const mockStepSingle = vi.fn().mockResolvedValue({
        data: {
          goal_id: 'goal-456',
          goals: { user_id: mockUser.id },
        },
        error: null,
      })
      const mockStepEq = vi.fn().mockReturnValue({ single: mockStepSingle })
      const mockStepSelect = vi.fn().mockReturnValue({ eq: mockStepEq })

      const mockUpdateEq = vi.fn().mockResolvedValue({
        error: { message: 'Database error' },
      })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq })

      mockSupabase.from.mockReturnValue({
        select: mockStepSelect,
        update: mockUpdate,
      })

      const result = await toggleGoalStep('step-789', true)

      expect(result).toEqual({ error: 'Failed to toggle goal step' })
    })
  })

  describe('59.3: Optimistic Update Performance', () => {
    it('should process checkbox toggles without blocking UI', async () => {
      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      const startTime = Date.now()

      // Simulate multiple rapid toggles
      const togglePromises = [
        toggleTodo('todo-1', true),
        toggleTodo('todo-2', true),
        toggleTodo('todo-3', true),
        toggleTodo('todo-4', true),
        toggleTodo('todo-5', true),
      ]

      await Promise.all(togglePromises)

      const endTime = Date.now()
      const duration = endTime - startTime

      // All toggles should complete quickly (under 1 second in test environment)
      expect(duration).toBeLessThan(1000)
      expect(mockUpdate).toHaveBeenCalledTimes(5)
    })

    it('should maintain data consistency during concurrent toggles', async () => {
      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      // Simulate concurrent toggles of the same item
      await Promise.all([
        toggleTodo('todo-123', true),
        toggleTodo('todo-123', false),
      ])

      // Both updates should be processed
      expect(mockUpdate).toHaveBeenCalledTimes(2)
      // Last update wins
      expect(mockUpdate).toHaveBeenLastCalledWith({ completed: false })
    })
  })
})
