import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createGoal, updateGoal, deleteGoal, createGoalStep, toggleGoalStep, deleteGoalStep } from './goals'
import { createClient } from '@/lib/supabase/server'

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock Next.js cache revalidation
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Goal Actions', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(),
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase)
  })

  describe('createGoal', () => {
    it('should create a goal with valid data', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const result = await createGoal({ title: 'Learn TypeScript' })

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('goals')
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        title: 'Learn TypeScript',
      })
    })

    it('should handle FormData input', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const formData = new FormData()
      formData.append('title', 'Complete project')

      const result = await createGoal(formData)

      expect(result).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        title: 'Complete project',
      })
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      const result = await createGoal({ title: 'Test Goal' })

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should validate required title field', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const result = await createGoal({ title: '' })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should return error when database insert fails', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockInsert = vi.fn().mockResolvedValue({ error: { message: 'DB error' } })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const result = await createGoal({ title: 'Test Goal' })

      expect(result).toEqual({ error: 'Failed to create goal' })
    })
  })

  describe('updateGoal', () => {
    it('should update a goal with valid data', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      const result = await updateGoal('goal-456', { title: 'Updated Goal' })

      expect(result).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({ title: 'Updated Goal' })
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      const result = await updateGoal('goal-456', { title: 'Updated Goal' })

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should validate title field', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const result = await updateGoal('goal-456', { title: '' })

      expect(result.error).toBe('Invalid fields')
    })
  })

  describe('deleteGoal', () => {
    it('should delete a goal and cascade delete steps', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ delete: mockDelete })

      const result = await deleteGoal('goal-456')

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('goals')
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      const result = await deleteGoal('goal-456')

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should return error when database delete fails', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockEq2 = vi.fn().mockResolvedValue({ error: { message: 'DB error' } })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ delete: mockDelete })

      const result = await deleteGoal('goal-456')

      expect(result).toEqual({ error: 'Failed to delete goal' })
    })
  })

  describe('createGoalStep', () => {
    it('should create a goal step with valid data', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      // Use a valid UUID format
      const validGoalId = '550e8400-e29b-41d4-a716-446655440000'

      // Mock goal verification
      const mockGoalSingle = vi.fn().mockResolvedValue({ 
        data: { id: validGoalId }, 
        error: null 
      })
      const mockGoalEq2 = vi.fn().mockReturnValue({ single: mockGoalSingle })
      const mockGoalEq1 = vi.fn().mockReturnValue({ eq: mockGoalEq2 })
      const mockGoalSelect = vi.fn().mockReturnValue({ eq: mockGoalEq1 })

      // Mock step insert
      const mockInsert = vi.fn().mockResolvedValue({ error: null })

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'goals') {
          return { select: mockGoalSelect }
        }
        return { insert: mockInsert }
      })

      const result = await createGoalStep({ 
        title: 'Complete chapter 1', 
        goal_id: validGoalId 
      })

      expect(result).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalledWith({
        completed: false,
        title: 'Complete chapter 1',
        goal_id: validGoalId,
      })
    })

    it('should return error when goal does not belong to user', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const validGoalId = '550e8400-e29b-41d4-a716-446655440999'

      const mockGoalSingle = vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Not found' } 
      })
      const mockGoalEq2 = vi.fn().mockReturnValue({ single: mockGoalSingle })
      const mockGoalEq1 = vi.fn().mockReturnValue({ eq: mockGoalEq2 })
      const mockGoalSelect = vi.fn().mockReturnValue({ eq: mockGoalEq1 })
      mockSupabase.from.mockReturnValue({ select: mockGoalSelect })

      const result = await createGoalStep({ 
        title: 'Test step', 
        goal_id: validGoalId 
      })

      expect(result).toEqual({ error: 'Goal not found or unauthorized' })
    })

    it('should validate required fields', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const result = await createGoalStep({ 
        title: '', 
        goal_id: 'goal-456' 
      })

      expect(result.error).toBe('Invalid fields')
    })
  })

  describe('toggleGoalStep', () => {
    it('should toggle a goal step completion status', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      // Mock step verification
      const mockStepSingle = vi.fn().mockResolvedValue({ 
        data: { 
          goal_id: 'goal-456',
          goals: { user_id: 'user-123' }
        }, 
        error: null 
      })
      const mockStepEq = vi.fn().mockReturnValue({ single: mockStepSingle })
      const mockStepSelect = vi.fn().mockReturnValue({ eq: mockStepEq })

      // Mock step update
      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq })

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'goal_steps') {
          return { 
            select: mockStepSelect,
            update: mockUpdate
          }
        }
      })

      const result = await toggleGoalStep('step-789', true)

      expect(result).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({ completed: true })
    })

    it('should return error when step does not belong to user', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockStepSingle = vi.fn().mockResolvedValue({ 
        data: { 
          goal_id: 'goal-456',
          goals: { user_id: 'user-999' }
        }, 
        error: null 
      })
      const mockStepEq = vi.fn().mockReturnValue({ single: mockStepSingle })
      const mockStepSelect = vi.fn().mockReturnValue({ eq: mockStepEq })
      mockSupabase.from.mockReturnValue({ select: mockStepSelect })

      const result = await toggleGoalStep('step-789', true)

      expect(result).toEqual({ error: 'Unauthorized' })
    })
  })

  describe('deleteGoalStep', () => {
    it('should delete a goal step', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      // Mock step verification
      const mockStepSingle = vi.fn().mockResolvedValue({ 
        data: { 
          goal_id: 'goal-456',
          goals: { user_id: 'user-123' }
        }, 
        error: null 
      })
      const mockStepEq = vi.fn().mockReturnValue({ single: mockStepSingle })
      const mockStepSelect = vi.fn().mockReturnValue({ eq: mockStepEq })

      // Mock step delete
      const mockDeleteEq = vi.fn().mockResolvedValue({ error: null })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq })

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'goal_steps') {
          return { 
            select: mockStepSelect,
            delete: mockDelete
          }
        }
      })

      const result = await deleteGoalStep('step-789')

      expect(result).toEqual({ success: true })
    })

    it('should return error when step not found', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockStepSingle = vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Not found' } 
      })
      const mockStepEq = vi.fn().mockReturnValue({ single: mockStepSingle })
      const mockStepSelect = vi.fn().mockReturnValue({ eq: mockStepEq })
      mockSupabase.from.mockReturnValue({ select: mockStepSelect })

      const result = await deleteGoalStep('step-999')

      expect(result).toEqual({ error: 'Goal step not found' })
    })
  })
})
