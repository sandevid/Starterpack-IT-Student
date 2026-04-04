import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from './calendar'
import { createClient } from '@/lib/supabase/server'
import type { CalendarEventInput } from '@/lib/validations/calendar'

// Mock Supabase server client
vi.mock('@/lib/supabase/server')

// Mock Next.js cache revalidation
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Calendar Actions', () => {
  let mockSupabase: any
  let mockUser: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
    }

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
  })

  describe('createCalendarEvent', () => {
    it('should create a calendar event with valid data', async () => {
      const eventData: CalendarEventInput = {
        title: 'Math Exam',
        date: '2024-12-15',
        notes: 'Chapter 1-5',
        color: 'exam',
      }

      const result = await createCalendarEvent(eventData)

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('calendar_events')
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        ...eventData,
      })
    })

    it('should create a calendar event from FormData', async () => {
      const formData = new FormData()
      formData.append('title', 'Science Project')
      formData.append('date', '2024-12-20')
      formData.append('notes', 'Final presentation')
      formData.append('color', 'deadline')

      const result = await createCalendarEvent(formData)

      expect(result).toEqual({ success: true })
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        title: 'Science Project',
        date: '2024-12-20',
        notes: 'Final presentation',
        color: 'deadline',
      })
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const eventData: CalendarEventInput = {
        title: 'Test Event',
        date: '2024-12-15',
        color: 'event',
      }

      const result = await createCalendarEvent(eventData)

      expect(result).toEqual({ error: 'Unauthorized' })
      expect(mockSupabase.insert).not.toHaveBeenCalled()
    })

    it('should return error when title is missing', async () => {
      const eventData = {
        title: '',
        date: '2024-12-15',
        color: 'exam',
      } as CalendarEventInput

      const result = await createCalendarEvent(eventData)

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
      expect(mockSupabase.insert).not.toHaveBeenCalled()
    })

    it('should return error when date is invalid', async () => {
      const eventData = {
        title: 'Test Event',
        date: 'invalid-date',
        color: 'exam',
      } as CalendarEventInput

      const result = await createCalendarEvent(eventData)

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
      expect(mockSupabase.insert).not.toHaveBeenCalled()
    })

    it('should return error when color is invalid', async () => {
      const eventData = {
        title: 'Test Event',
        date: '2024-12-15',
        color: 'invalid-color',
      } as any

      const result = await createCalendarEvent(eventData)

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
      expect(mockSupabase.insert).not.toHaveBeenCalled()
    })

    it('should return error when database insert fails', async () => {
      mockSupabase.insert.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const eventData: CalendarEventInput = {
        title: 'Test Event',
        date: '2024-12-15',
        color: 'exam',
      }

      const result = await createCalendarEvent(eventData)

      expect(result).toEqual({ error: 'Failed to create event' })
    })

    it('should handle optional notes field', async () => {
      const eventData: CalendarEventInput = {
        title: 'Quick Reminder',
        date: '2024-12-15',
        color: 'reminder',
      }

      const result = await createCalendarEvent(eventData)

      expect(result).toEqual({ success: true })
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        title: 'Quick Reminder',
        date: '2024-12-15',
        color: 'reminder',
      })
    })
  })

  describe('updateCalendarEvent', () => {
    it('should update a calendar event with valid data', async () => {
      const eventId = 'event-123'
      const eventData: CalendarEventInput = {
        title: 'Updated Math Exam',
        date: '2024-12-16',
        notes: 'Chapter 1-6',
        color: 'exam',
      }

      const result = await updateCalendarEvent(eventId, eventData)

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('calendar_events')
      expect(mockSupabase.update).toHaveBeenCalledWith(eventData)
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', eventId)
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', mockUser.id)
    })

    it('should update a calendar event from FormData', async () => {
      const eventId = 'event-123'
      const formData = new FormData()
      formData.append('title', 'Updated Event')
      formData.append('date', '2024-12-20')
      formData.append('color', 'deadline')

      const result = await updateCalendarEvent(eventId, formData)

      expect(result).toEqual({ success: true })
      expect(mockSupabase.update).toHaveBeenCalledWith({
        title: 'Updated Event',
        date: '2024-12-20',
        color: 'deadline',
      })
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const eventData: CalendarEventInput = {
        title: 'Test Event',
        date: '2024-12-15',
        color: 'event',
      }

      const result = await updateCalendarEvent('event-123', eventData)

      expect(result).toEqual({ error: 'Unauthorized' })
      expect(mockSupabase.update).not.toHaveBeenCalled()
    })

    it('should return error when validation fails', async () => {
      const eventData = {
        title: '',
        date: '2024-12-15',
        color: 'exam',
      } as CalendarEventInput

      const result = await updateCalendarEvent('event-123', eventData)

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
      expect(mockSupabase.update).not.toHaveBeenCalled()
    })

    it('should return error when database update fails', async () => {
      const mockEq2 = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      mockSupabase.update = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from = vi.fn().mockReturnValue(mockSupabase)

      const eventData: CalendarEventInput = {
        title: 'Test Event',
        date: '2024-12-15',
        color: 'exam',
      }

      const result = await updateCalendarEvent('event-123', eventData)

      expect(result).toEqual({ error: 'Failed to update event' })
    })
  })

  describe('deleteCalendarEvent', () => {
    it('should delete a calendar event', async () => {
      const eventId = 'event-123'

      const result = await deleteCalendarEvent(eventId)

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('calendar_events')
      expect(mockSupabase.delete).toHaveBeenCalled()
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', eventId)
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', mockUser.id)
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await deleteCalendarEvent('event-123')

      expect(result).toEqual({ error: 'Unauthorized' })
      expect(mockSupabase.delete).not.toHaveBeenCalled()
    })

    it('should return error when database delete fails', async () => {
      const mockEq2 = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      mockSupabase.delete = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from = vi.fn().mockReturnValue(mockSupabase)

      const result = await deleteCalendarEvent('event-123')

      expect(result).toEqual({ error: 'Failed to delete event' })
    })
  })
})
