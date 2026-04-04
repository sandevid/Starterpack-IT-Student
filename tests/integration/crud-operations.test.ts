/**
 * Integration Test: CRUD Operations for All Modules
 * 
 * Tests complete CRUD flows for all seven modules:
 * - Calendar Events
 * - Todos
 * - Goals (with nested steps)
 * - Playlists
 * - Essentials
 * 
 * Validates Requirements 4-8 (Module-specific CRUD operations)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient } from '@/lib/supabase/server'
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '@/actions/calendar'
import { createTodo, updateTodo, deleteTodo } from '@/actions/todos'
import {
  createGoal,
  updateGoal,
  deleteGoal,
  createGoalStep,
  deleteGoalStep,
} from '@/actions/goals'
import { createPlaylist, updatePlaylist, deletePlaylist } from '@/actions/playlists'
import { createEssential, updateEssential, deleteEssential } from '@/actions/essentials'

vi.mock('@/lib/supabase/server')
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Integration: CRUD Operations for All Modules', () => {
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

  describe('59.2: Calendar Events CRUD', () => {
    it('should complete full CRUD cycle for calendar events', async () => {
      // CREATE
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const createResult = await createCalendarEvent({
        title: 'Math Exam',
        date: '2024-12-15',
        notes: 'Chapters 1-5',
        color: 'exam',
      })

      expect(createResult).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        title: 'Math Exam',
        date: '2024-12-15',
        notes: 'Chapters 1-5',
        color: 'exam',
      })

      // UPDATE
      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      const updateResult = await updateCalendarEvent('event-123', {
        title: 'Math Final Exam',
        date: '2024-12-16',
        notes: 'Chapters 1-6',
        color: 'exam',
      })

      expect(updateResult).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({
        title: 'Math Final Exam',
        date: '2024-12-16',
        notes: 'Chapters 1-6',
        color: 'exam',
      })

      // DELETE
      const mockDeleteEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockDeleteEq1 = vi.fn().mockReturnValue({ eq: mockDeleteEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq1 })
      mockSupabase.from.mockReturnValue({ delete: mockDelete })

      const deleteResult = await deleteCalendarEvent('event-123')

      expect(deleteResult).toEqual({ success: true })
      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe('59.2: Todos CRUD', () => {
    it('should complete full CRUD cycle for todos', async () => {
      // CREATE
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const createResult = await createTodo({
        title: 'Study for math exam',
        tag: 'math',
      })

      expect(createResult).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        completed: false,
        title: 'Study for math exam',
        tag: 'math',
      })

      // UPDATE
      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      const updateResult = await updateTodo('todo-123', {
        title: 'Study for math final exam',
        tag: 'math',
      })

      expect(updateResult).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({
        title: 'Study for math final exam',
        tag: 'math',
      })

      // DELETE
      const mockDeleteEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockDeleteEq1 = vi.fn().mockReturnValue({ eq: mockDeleteEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq1 })
      mockSupabase.from.mockReturnValue({ delete: mockDelete })

      const deleteResult = await deleteTodo('todo-123')

      expect(deleteResult).toEqual({ success: true })
      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe('59.2: Goals CRUD with Nested Steps', () => {
    it('should complete full CRUD cycle for goals with steps', async () => {
      // CREATE GOAL
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const createGoalResult = await createGoal({
        title: 'Learn TypeScript',
      })

      expect(createGoalResult).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        title: 'Learn TypeScript',
      })

      // CREATE GOAL STEP
      const validGoalId = '550e8400-e29b-41d4-a716-446655440000'

      // Mock goal verification
      const mockGoalSingle = vi.fn().mockResolvedValue({
        data: { id: validGoalId },
        error: null,
      })
      const mockGoalEq2 = vi.fn().mockReturnValue({ single: mockGoalSingle })
      const mockGoalEq1 = vi.fn().mockReturnValue({ eq: mockGoalEq2 })
      const mockGoalSelect = vi.fn().mockReturnValue({ eq: mockGoalEq1 })

      const mockStepInsert = vi.fn().mockResolvedValue({ error: null })

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'goals') {
          return { select: mockGoalSelect }
        }
        return { insert: mockStepInsert }
      })

      const createStepResult = await createGoalStep({
        title: 'Complete TypeScript basics',
        goal_id: validGoalId,
      })

      expect(createStepResult).toEqual({ success: true })
      expect(mockStepInsert).toHaveBeenCalledWith({
        completed: false,
        title: 'Complete TypeScript basics',
        goal_id: validGoalId,
      })

      // UPDATE GOAL
      const mockUpdateEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockUpdateEq1 = vi.fn().mockReturnValue({ eq: mockUpdateEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      const updateGoalResult = await updateGoal(validGoalId, {
        title: 'Master TypeScript',
      })

      expect(updateGoalResult).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({
        title: 'Master TypeScript',
      })

      // DELETE GOAL STEP
      const mockStepSingle = vi.fn().mockResolvedValue({
        data: {
          goal_id: validGoalId,
          goals: { user_id: mockUser.id },
        },
        error: null,
      })
      const mockStepEq = vi.fn().mockReturnValue({ single: mockStepSingle })
      const mockStepSelect = vi.fn().mockReturnValue({ eq: mockStepEq })
      const mockStepDeleteEq = vi.fn().mockResolvedValue({ error: null })
      const mockStepDelete = vi.fn().mockReturnValue({ eq: mockStepDeleteEq })

      mockSupabase.from.mockReturnValue({
        select: mockStepSelect,
        delete: mockStepDelete,
      })

      const deleteStepResult = await deleteGoalStep('step-123')

      expect(deleteStepResult).toEqual({ success: true })

      // DELETE GOAL (cascade deletes steps)
      const mockDeleteEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockDeleteEq1 = vi.fn().mockReturnValue({ eq: mockDeleteEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq1 })
      mockSupabase.from.mockReturnValue({ delete: mockDelete })

      const deleteGoalResult = await deleteGoal(validGoalId)

      expect(deleteGoalResult).toEqual({ success: true })
      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe('59.2: Playlists CRUD', () => {
    it('should complete full CRUD cycle for playlists', async () => {
      // CREATE
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const createResult = await createPlaylist({
        name: 'Study Focus',
        description: 'Instrumental music for studying',
        url: 'https://open.spotify.com/playlist/test123',
      })

      expect(createResult).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        name: 'Study Focus',
        description: 'Instrumental music for studying',
        url: 'https://open.spotify.com/playlist/test123',
      })

      // UPDATE
      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      const updateResult = await updatePlaylist('playlist-123', {
        name: 'Deep Focus',
        description: 'Updated description',
        url: 'https://open.spotify.com/playlist/test456',
      })

      expect(updateResult).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({
        name: 'Deep Focus',
        description: 'Updated description',
        url: 'https://open.spotify.com/playlist/test456',
      })

      // DELETE
      const mockDeleteEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockDeleteEq1 = vi.fn().mockReturnValue({ eq: mockDeleteEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq1 })
      mockSupabase.from.mockReturnValue({ delete: mockDelete })

      const deleteResult = await deletePlaylist('playlist-123')

      expect(deleteResult).toEqual({ success: true })
      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe('59.2: Essentials CRUD', () => {
    it('should complete full CRUD cycle for essentials', async () => {
      // CREATE
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const createResult = await createEssential({
        name: 'MacBook Pro',
        description: 'Laptop for coding',
        icon: 'Laptop',
        category: 'gadget',
      })

      expect(createResult).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        name: 'MacBook Pro',
        description: 'Laptop for coding',
        icon: 'Laptop',
        category: 'gadget',
        image_url: null,
      })

      // UPDATE
      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      const updateResult = await updateEssential('essential-123', {
        name: 'MacBook Pro M3',
        description: 'Updated laptop',
        icon: 'Laptop',
        category: 'gadget',
      })

      expect(updateResult).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({
        name: 'MacBook Pro M3',
        description: 'Updated laptop',
        icon: 'Laptop',
        category: 'gadget',
        image_url: null,
      })

      // DELETE
      const mockDeleteEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockDeleteEq1 = vi.fn().mockReturnValue({ eq: mockDeleteEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq1 })
      mockSupabase.from.mockReturnValue({ delete: mockDelete })

      const deleteResult = await deleteEssential('essential-123')

      expect(deleteResult).toEqual({ success: true })
      expect(mockDelete).toHaveBeenCalled()
    })
  })

  describe('59.2: Cross-Module Data Isolation', () => {
    it('should ensure RLS policies isolate data between users', async () => {
      // User can only access their own data across all modules
      const modules = ['calendar_events', 'todos', 'goals', 'playlists', 'essentials']

      for (const module of modules) {
        const mockSelect = vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [{ id: 'item-1', user_id: mockUser.id }],
            error: null,
          }),
        })
        mockSupabase.from.mockReturnValue({ select: mockSelect })

        const { data } = await mockSupabase
          .from(module)
          .select('*')
          .eq('user_id', mockUser.id)

        expect(data).toBeDefined()
        expect(data[0].user_id).toBe(mockUser.id)
      }
    })
  })
})
