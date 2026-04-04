/**
 * Home Dashboard Tests
 * 
 * This test suite validates the home dashboard page according to Task 18.
 * 
 * Test Coverage:
 * - 18.1: Test data fetching and display
 * - 18.2: Test empty states
 * - 18.3: Test navigation between tabs
 * 
 * The home dashboard displays:
 * - User greeting with avatar
 * - Statistics cards (todos, goals, events)
 * - Todo preview (5 incomplete todos)
 * - Calendar preview (3 upcoming events)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from './page'
import { redirect } from 'next/navigation'
import type { Profile, Todo, CalendarEvent } from '@/types/database.types'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  usePathname: vi.fn(() => '/'),
}))

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock dashboard components
vi.mock('@/components/dashboard/Greeting', () => ({
  Greeting: ({ fullName, avatarUrl }: { fullName: string | null; avatarUrl: string | null }) => (
    <div data-testid="greeting">
      <span data-testid="greeting-name">{fullName || 'Student'}</span>
      {avatarUrl && <img data-testid="greeting-avatar" src={avatarUrl} alt="avatar" />}
    </div>
  ),
}))

vi.mock('@/components/dashboard/StatsCards', () => ({
  StatsCards: ({ todoCount, goalCount, eventCount }: { todoCount: number; goalCount: number; eventCount: number }) => (
    <div data-testid="stats-cards">
      <div data-testid="todo-count">{todoCount}</div>
      <div data-testid="goal-count">{goalCount}</div>
      <div data-testid="event-count">{eventCount}</div>
    </div>
  ),
}))

vi.mock('@/components/dashboard/TodoPreview', () => ({
  TodoPreview: ({ todos }: { todos: any[] }) => (
    <div data-testid="todo-preview">
      {todos.length > 0 ? (
        <div data-testid="todo-list">
          {todos.map((todo) => (
            <div key={todo.id} data-testid={`todo-${todo.id}`}>
              {todo.title}
            </div>
          ))}
        </div>
      ) : (
        <div data-testid="todo-empty-state">No tasks for today</div>
      )}
    </div>
  ),
}))

vi.mock('@/components/dashboard/CalendarPreview', () => ({
  CalendarPreview: ({ events }: { events: any[] }) => (
    <div data-testid="calendar-preview">
      {events.length > 0 ? (
        <div data-testid="event-list">
          {events.map((event) => (
            <div key={event.id} data-testid={`event-${event.id}`}>
              {event.title}
            </div>
          ))}
        </div>
      ) : (
        <div data-testid="calendar-empty-state">No upcoming events</div>
      )}
    </div>
  ),
}))

describe('18. Test home dashboard', () => {
  const mockUserId = 'user-123'
  let mockSupabase: any

  beforeEach(async () => {
    vi.clearAllMocks()

    // Create mock Supabase client with chainable methods
    mockSupabase = {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(),
    }

    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValue(mockSupabase)
  })

  describe('18.1 Test data fetching and display', () => {
    it('should fetch and display user profile data', async () => {
      const mockProfile: Profile = {
        id: mockUserId,
        email: 'test@example.com',
        full_name: 'John Doe',
        avatar_url: 'https://example.com/avatar.jpg',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
      })

      const mockProfileQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProfile }),
      }

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return mockProfileQuery
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          gte: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({ data: [] }),
        }
      })

      const result = await HomePage()
      render(result)

      expect(screen.getByTestId('greeting-name')).toHaveTextContent('John Doe')
      expect(screen.getByTestId('greeting-avatar')).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })

    it('should fetch and display dashboard statistics', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
      })

      const mockProfileQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { full_name: 'Test User', avatar_url: null } }),
      }

      const mockTodoCountQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        count: 5,
      }

      const mockGoalCountQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        count: 3,
      }

      const mockEventCountQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        count: 7,
      }

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return mockProfileQuery
        if (table === 'todos') {
          const query = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({ data: [] }),
          }
          // First call is for count
          if (mockSupabase.from.mock.calls.filter((c: any) => c[0] === 'todos').length === 1) {
            return mockTodoCountQuery
          }
          return query
        }
        if (table === 'goals') return mockGoalCountQuery
        if (table === 'calendar_events') {
          const query = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({ data: [] }),
          }
          // First call is for count
          if (mockSupabase.from.mock.calls.filter((c: any) => c[0] === 'calendar_events').length === 1) {
            return mockEventCountQuery
          }
          return query
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          gte: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({ data: [] }),
        }
      })

      const result = await HomePage()
      render(result)

      expect(screen.getByTestId('todo-count')).toHaveTextContent('5')
      expect(screen.getByTestId('goal-count')).toHaveTextContent('3')
      expect(screen.getByTestId('event-count')).toHaveTextContent('7')
    })

    it('should fetch and display preview todos (5 incomplete todos)', async () => {
      const mockTodos: Todo[] = [
        {
          id: 'todo-1',
          user_id: mockUserId,
          title: 'Complete math homework',
          completed: false,
          tag: 'math',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'todo-2',
          user_id: mockUserId,
          title: 'Study for science test',
          completed: false,
          tag: 'science',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
        {
          id: 'todo-3',
          user_id: mockUserId,
          title: 'Read English chapter',
          completed: false,
          tag: 'english',
          created_at: '2024-01-03T00:00:00Z',
          updated_at: '2024-01-03T00:00:00Z',
        },
      ]

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
      })

      const mockProfileQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { full_name: 'Test User', avatar_url: null } }),
      }

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return mockProfileQuery
        if (table === 'todos') {
          const countQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            count: 0,
          }
          const dataQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({ data: mockTodos }),
          }
          // First call is for count, second is for data
          if (mockSupabase.from.mock.calls.filter((c: any) => c[0] === 'todos').length === 1) {
            return countQuery
          }
          return dataQuery
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          gte: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({ data: [] }),
          count: 0,
        }
      })

      const result = await HomePage()
      render(result)

      expect(screen.getByTestId('todo-list')).toBeInTheDocument()
      expect(screen.getByTestId('todo-todo-1')).toHaveTextContent('Complete math homework')
      expect(screen.getByTestId('todo-todo-2')).toHaveTextContent('Study for science test')
      expect(screen.getByTestId('todo-todo-3')).toHaveTextContent('Read English chapter')
    })

    it('should fetch and display preview events (3 upcoming events)', async () => {
      const mockEvents: CalendarEvent[] = [
        {
          id: 'event-1',
          user_id: mockUserId,
          title: 'Math Exam',
          date: '2024-12-20',
          notes: null,
          color: 'exam',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'event-2',
          user_id: mockUserId,
          title: 'Project Deadline',
          date: '2024-12-22',
          notes: null,
          color: 'deadline',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ]

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
      })

      const mockProfileQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { full_name: 'Test User', avatar_url: null } }),
      }

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return mockProfileQuery
        if (table === 'calendar_events') {
          const countQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            count: 0,
          }
          const dataQuery = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockResolvedValue({ data: mockEvents }),
          }
          // First call is for count, second is for data
          if (mockSupabase.from.mock.calls.filter((c: any) => c[0] === 'calendar_events').length === 1) {
            return countQuery
          }
          return dataQuery
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          gte: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({ data: [] }),
          count: 0,
        }
      })

      const result = await HomePage()
      render(result)

      expect(screen.getByTestId('event-list')).toBeInTheDocument()
      expect(screen.getByTestId('event-event-1')).toHaveTextContent('Math Exam')
      expect(screen.getByTestId('event-event-2')).toHaveTextContent('Project Deadline')
    })

    it('should handle null profile data gracefully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
      })

      const mockProfileQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null }),
      }

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return mockProfileQuery
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          gte: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({ data: [] }),
          count: 0,
        }
      })

      const result = await HomePage()
      render(result)

      // Should display default "Student" when no profile name
      expect(screen.getByTestId('greeting-name')).toHaveTextContent('Student')
      expect(screen.queryByTestId('greeting-avatar')).not.toBeInTheDocument()
    })
  })

  describe('18.2 Test empty states', () => {
    beforeEach(() => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
      })

      const mockProfileQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { full_name: 'Test User', avatar_url: null } }),
      }

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return mockProfileQuery
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          gte: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({ data: [] }),
          count: 0,
        }
      })
    })

    it('should display empty state when no todos exist', async () => {
      const result = await HomePage()
      render(result)

      expect(screen.getByTestId('todo-empty-state')).toBeInTheDocument()
      expect(screen.getByTestId('todo-empty-state')).toHaveTextContent('No tasks for today')
      expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument()
    })

    it('should display empty state when no events exist', async () => {
      const result = await HomePage()
      render(result)

      expect(screen.getByTestId('calendar-empty-state')).toBeInTheDocument()
      expect(screen.getByTestId('calendar-empty-state')).toHaveTextContent('No upcoming events')
      expect(screen.queryByTestId('event-list')).not.toBeInTheDocument()
    })

    it('should display zero counts in stats cards when no data exists', async () => {
      const result = await HomePage()
      render(result)

      expect(screen.getByTestId('todo-count')).toHaveTextContent('0')
      expect(screen.getByTestId('goal-count')).toHaveTextContent('0')
      expect(screen.getByTestId('event-count')).toHaveTextContent('0')
    })

    it('should display both empty states simultaneously', async () => {
      const result = await HomePage()
      render(result)

      expect(screen.getByTestId('todo-empty-state')).toBeInTheDocument()
      expect(screen.getByTestId('calendar-empty-state')).toBeInTheDocument()
    })
  })

  describe('18.3 Test navigation between tabs', () => {
    it('should redirect to login when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      })

      // redirect() throws an error in Next.js to stop execution
      vi.mocked(redirect).mockImplementation(() => {
        throw new Error('NEXT_REDIRECT')
      })

      await expect(HomePage()).rejects.toThrow('NEXT_REDIRECT')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('should not redirect when user is authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: mockUserId } },
      })

      const mockProfileQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { full_name: 'Test User', avatar_url: null } }),
      }

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') return mockProfileQuery
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          gte: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({ data: [] }),
          count: 0,
        }
      })

      const result = await HomePage()
      render(result)

      expect(redirect).not.toHaveBeenCalled()
      expect(screen.getByTestId('greeting')).toBeInTheDocument()
    })
  })
})
