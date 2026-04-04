import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTodo, updateTodo, toggleTodo, deleteTodo } from './todos'
import { createClient } from '@/lib/supabase/server'
import type { TodoInput } from '@/lib/validations/todo'

// Mock dependencies
vi.mock('@/lib/supabase/server')
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Todo Server Actions', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  }

  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
  })

  describe('createTodo', () => {
    it('should create a todo with valid data', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      })

      const todoData: TodoInput = {
        title: 'Study for math exam',
        tag: 'math',
      }

      const result = await createTodo(todoData)

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('todos')
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        completed: false,
        title: 'Study for math exam',
        tag: 'math',
      })
    })

    it('should handle FormData input', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      })

      const formData = new FormData()
      formData.append('title', 'Write English essay')
      formData.append('tag', 'english')

      const result = await createTodo(formData)

      expect(result).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        completed: false,
        title: 'Write English essay',
        tag: 'english',
      })
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const todoData: TodoInput = {
        title: 'Study for math exam',
        tag: 'math',
      }

      const result = await createTodo(todoData)

      expect(result).toEqual({ error: 'Unauthorized' })
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })

    it('should validate required fields', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const invalidData = {
        title: '',
        tag: 'math',
      } as TodoInput

      const result = await createTodo(invalidData)

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })

    it('should validate tag enum', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const invalidData = {
        title: 'Study',
        tag: 'invalid-tag',
      } as any

      const result = await createTodo(invalidData)

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should return error when database insert fails', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockInsert = vi.fn().mockResolvedValue({
        error: { message: 'Database error' },
      })
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      })

      const todoData: TodoInput = {
        title: 'Study for math exam',
        tag: 'math',
      }

      const result = await createTodo(todoData)

      expect(result).toEqual({ error: 'Failed to create todo' })
    })
  })

  describe('updateTodo', () => {
    it('should update a todo with valid data', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockEq = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      })
      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      })

      const todoData: TodoInput = {
        title: 'Updated title',
        tag: 'science',
      }

      const result = await updateTodo('todo-123', todoData)

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('todos')
      expect(mockUpdate).toHaveBeenCalledWith({
        title: 'Updated title',
        tag: 'science',
      })
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const todoData: TodoInput = {
        title: 'Updated title',
        tag: 'math',
      }

      const result = await updateTodo('todo-123', todoData)

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should validate fields before updating', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const invalidData = {
        title: '',
        tag: 'math',
      } as TodoInput

      const result = await updateTodo('todo-123', invalidData)

      expect(result.error).toBe('Invalid fields')
    })

    it('should return error when database update fails', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockEq = vi.fn().mockResolvedValue({
        error: { message: 'Database error' },
      })
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      })
      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      })

      const todoData: TodoInput = {
        title: 'Updated title',
        tag: 'math',
      }

      const result = await updateTodo('todo-123', todoData)

      expect(result).toEqual({ error: 'Failed to update todo' })
    })
  })

  describe('toggleTodo', () => {
    it('should toggle todo to completed', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockEq = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      })
      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      })

      const result = await toggleTodo('todo-123', true)

      expect(result).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({ completed: true })
    })

    it('should toggle todo to incomplete', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockEq = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      })
      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      })

      const result = await toggleTodo('todo-123', false)

      expect(result).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({ completed: false })
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await toggleTodo('todo-123', true)

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should return error when database update fails', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockEq = vi.fn().mockResolvedValue({
        error: { message: 'Database error' },
      })
      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      })
      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      })

      const result = await toggleTodo('todo-123', true)

      expect(result).toEqual({ error: 'Failed to toggle todo' })
    })
  })

  describe('deleteTodo', () => {
    it('should delete a todo successfully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockEq = vi.fn().mockResolvedValue({ error: null })
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      })
      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      })

      const result = await deleteTodo('todo-123')

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('todos')
      expect(mockDelete).toHaveBeenCalled()
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await deleteTodo('todo-123')

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should return error when database delete fails', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockEq = vi.fn().mockResolvedValue({
        error: { message: 'Database error' },
      })
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: mockEq,
        }),
      })
      mockSupabase.from.mockReturnValue({
        delete: mockDelete,
      })

      const result = await deleteTodo('todo-123')

      expect(result).toEqual({ error: 'Failed to delete todo' })
    })
  })
})
