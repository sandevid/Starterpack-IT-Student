/**
 * Integration Test: Form Validation
 * 
 * Tests form validation flows for all module forms:
 * - Calendar Event Form
 * - Todo Form
 * - Goal Form
 * - Goal Step Form
 * - Playlist Form
 * - Essential Form
 * 
 * Validates Requirement 11 (Form Validation and Error Handling)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient } from '@/lib/supabase/server'
import {
  createCalendarEvent,
  updateCalendarEvent,
} from '@/actions/calendar'
import { createTodo, updateTodo } from '@/actions/todos'
import { createGoal, createGoalStep } from '@/actions/goals'
import { createPlaylist, updatePlaylist } from '@/actions/playlists'
import { createEssential, updateEssential } from '@/actions/essentials'

vi.mock('@/lib/supabase/server')
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Integration: Form Validation', () => {
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

  describe('59.4: Calendar Event Form Validation', () => {
    it('should validate required title field', async () => {
      const result = await createCalendarEvent({
        title: '',
        date: '2024-12-15',
        color: 'exam',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should validate date format', async () => {
      const result = await createCalendarEvent({
        title: 'Test Event',
        date: 'invalid-date',
        color: 'exam',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should validate color enum', async () => {
      const result = await createCalendarEvent({
        title: 'Test Event',
        date: '2024-12-15',
        color: 'invalid-color' as any,
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should accept valid calendar event data', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const result = await createCalendarEvent({
        title: 'Math Exam',
        date: '2024-12-15',
        notes: 'Chapters 1-5',
        color: 'exam',
      })

      expect(result).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalled()
    })

    it('should validate all color options', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const validColors = ['exam', 'deadline', 'event', 'reminder'] as const

      for (const color of validColors) {
        const result = await createCalendarEvent({
          title: 'Test Event',
          date: '2024-12-15',
          color,
        })

        expect(result).toEqual({ success: true })
      }
    })

    it('should handle optional notes field', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const result = await createCalendarEvent({
        title: 'Quick Event',
        date: '2024-12-15',
        color: 'reminder',
      })

      expect(result).toEqual({ success: true })
    })
  })

  describe('59.4: Todo Form Validation', () => {
    it('should validate required title field', async () => {
      const result = await createTodo({
        title: '',
        tag: 'math',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should validate tag enum', async () => {
      const result = await createTodo({
        title: 'Study',
        tag: 'invalid-tag' as any,
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should accept all valid tag options', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const validTags = ['math', 'english', 'science', 'ipa', 'ips', 'general'] as const

      for (const tag of validTags) {
        const result = await createTodo({
          title: 'Test Todo',
          tag,
        })

        expect(result).toEqual({ success: true })
      }

      expect(mockInsert).toHaveBeenCalledTimes(6)
    })

    it('should validate title length', async () => {
      const longTitle = 'a'.repeat(201)

      const result = await createTodo({
        title: longTitle,
        tag: 'general',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should accept valid todo data', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const result = await createTodo({
        title: 'Study for math exam',
        tag: 'math',
      })

      expect(result).toEqual({ success: true })
    })
  })

  describe('59.4: Goal Form Validation', () => {
    it('should validate required title field', async () => {
      const result = await createGoal({
        title: '',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should validate title length', async () => {
      const longTitle = 'a'.repeat(201)

      const result = await createGoal({
        title: longTitle,
      })

      expect(result.error).toBe('Invalid fields')
    })

    it('should accept valid goal data', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const result = await createGoal({
        title: 'Learn TypeScript',
      })

      expect(result).toEqual({ success: true })
    })
  })

  describe('59.4: Goal Step Form Validation', () => {
    it('should validate required title field', async () => {
      const validGoalId = '550e8400-e29b-41d4-a716-446655440000'

      const result = await createGoalStep({
        title: '',
        goal_id: validGoalId,
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should validate goal_id format', async () => {
      const result = await createGoalStep({
        title: 'Test Step',
        goal_id: 'invalid-uuid',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should accept valid goal step data', async () => {
      const validGoalId = '550e8400-e29b-41d4-a716-446655440000'

      // Mock goal verification
      const mockGoalSingle = vi.fn().mockResolvedValue({
        data: { id: validGoalId },
        error: null,
      })
      const mockGoalEq2 = vi.fn().mockReturnValue({ single: mockGoalSingle })
      const mockGoalEq1 = vi.fn().mockReturnValue({ eq: mockGoalEq2 })
      const mockGoalSelect = vi.fn().mockReturnValue({ eq: mockGoalEq1 })

      const mockInsert = vi.fn().mockResolvedValue({ error: null })

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'goals') {
          return { select: mockGoalSelect }
        }
        return { insert: mockInsert }
      })

      const result = await createGoalStep({
        title: 'Complete chapter 1',
        goal_id: validGoalId,
      })

      expect(result).toEqual({ success: true })
    })
  })

  describe('59.4: Playlist Form Validation', () => {
    it('should validate required name field', async () => {
      const result = await createPlaylist({
        name: '',
        url: 'https://open.spotify.com/playlist/test',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details?.name).toBeDefined()
    })

    it('should validate URL format', async () => {
      const result = await createPlaylist({
        name: 'Test Playlist',
        url: 'invalid-url',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details?.url).toBeDefined()
    })

    it('should validate Spotify URL pattern', async () => {
      const result = await createPlaylist({
        name: 'Test Playlist',
        url: 'https://youtube.com/playlist/test',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details?.url).toBeDefined()
    })

    it('should accept valid Spotify URLs', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const validUrls = [
        'https://open.spotify.com/playlist/test123',
        'https://open.spotify.com/playlist/abc456def',
      ]

      for (const url of validUrls) {
        const result = await createPlaylist({
          name: 'Test Playlist',
          url,
        })

        expect(result).toEqual({ success: true })
      }
    })

    it('should handle optional description field', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const result = await createPlaylist({
        name: 'Study Focus',
        url: 'https://open.spotify.com/playlist/test',
      })

      expect(result).toEqual({ success: true })
    })

    it('should validate description length', async () => {
      const longDescription = 'a'.repeat(501)

      const result = await createPlaylist({
        name: 'Test Playlist',
        description: longDescription,
        url: 'https://open.spotify.com/playlist/test',
      })

      expect(result.error).toBe('Invalid fields')
    })
  })

  describe('59.4: Essential Form Validation', () => {
    it('should validate required name field', async () => {
      const result = await createEssential({
        name: '',
        icon: 'Laptop',
        category: 'gadget',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details?.name).toBeDefined()
    })

    it('should validate icon enum', async () => {
      const result = await createEssential({
        name: 'Test Item',
        icon: 'InvalidIcon' as any,
        category: 'gadget',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details?.icon).toBeDefined()
    })

    it('should validate category enum', async () => {
      const result = await createEssential({
        name: 'Test Item',
        icon: 'Laptop',
        category: 'invalid-category' as any,
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details?.category).toBeDefined()
    })

    it('should accept all valid icon options', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const validIcons = [
        'Laptop',
        'Headphones',
        'BookOpen',
        'Pen',
        'Backpack',
        'Watch',
        'Glasses',
        'Coffee',
        'Package',
        'Star',
      ] as const

      for (const icon of validIcons) {
        const result = await createEssential({
          name: 'Test Item',
          icon,
          category: 'gadget',
        })

        expect(result).toEqual({ success: true })
      }

      expect(mockInsert).toHaveBeenCalledTimes(10)
    })

    it('should accept all valid category options', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const validCategories = ['gadget', 'stationery', 'fashion', 'book', 'general'] as const

      for (const category of validCategories) {
        const result = await createEssential({
          name: 'Test Item',
          icon: 'Laptop',
          category,
        })

        expect(result).toEqual({ success: true })
      }

      expect(mockInsert).toHaveBeenCalledTimes(5)
    })

    it('should handle optional description field', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const result = await createEssential({
        name: 'MacBook Pro',
        icon: 'Laptop',
        category: 'gadget',
      })

      expect(result).toEqual({ success: true })
    })
  })

  describe('59.4: Cross-Form Validation Consistency', () => {
    it('should consistently reject empty required fields across all forms', async () => {
      const emptyFieldTests = [
        { action: createCalendarEvent, data: { title: '', date: '2024-12-15', color: 'exam' } },
        { action: createTodo, data: { title: '', tag: 'math' } },
        { action: createGoal, data: { title: '' } },
        { action: createPlaylist, data: { name: '', url: 'https://open.spotify.com/playlist/test' } },
        { action: createEssential, data: { name: '', icon: 'Laptop', category: 'gadget' } },
      ]

      for (const test of emptyFieldTests) {
        const result = await test.action(test.data as any)
        expect(result.error).toBe('Invalid fields')
        expect(result.details).toBeDefined()
      }
    })

    it('should provide detailed validation errors for all forms', async () => {
      // Each form should return field-specific error details
      const calendarResult = await createCalendarEvent({
        title: '',
        date: 'invalid',
        color: 'invalid' as any,
      })

      expect(calendarResult.error).toBe('Invalid fields')
      expect(calendarResult.details).toBeDefined()

      const todoResult = await createTodo({
        title: '',
        tag: 'invalid' as any,
      })

      expect(todoResult.error).toBe('Invalid fields')
      expect(todoResult.details).toBeDefined()
    })
  })
})
