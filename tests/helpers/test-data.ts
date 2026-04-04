import type {
  CalendarEvent,
  Todo,
  Goal,
  GoalStep,
  Playlist,
  Essential,
  Profile,
} from '@/types/database.types'

/**
 * Factory functions for creating test data
 */

export function createTestProfile(overrides?: Partial<Profile>): Profile {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createTestCalendarEvent(overrides?: Partial<CalendarEvent>): CalendarEvent {
  return {
    id: 'event-1',
    user_id: 'test-user-id',
    title: 'Test Event',
    date: new Date().toISOString().split('T')[0],
    notes: 'Test notes',
    color: 'exam',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createTestTodo(overrides?: Partial<Todo>): Todo {
  return {
    id: 'todo-1',
    user_id: 'test-user-id',
    title: 'Test Todo',
    completed: false,
    tag: 'general',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createTestGoal(overrides?: Partial<Goal>): Goal {
  return {
    id: 'goal-1',
    user_id: 'test-user-id',
    title: 'Test Goal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createTestGoalStep(overrides?: Partial<GoalStep>): GoalStep {
  return {
    id: 'step-1',
    goal_id: 'goal-1',
    title: 'Test Step',
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createTestPlaylist(overrides?: Partial<Playlist>): Playlist {
  return {
    id: 'playlist-1',
    user_id: 'test-user-id',
    name: 'Test Playlist',
    description: 'Test description',
    url: 'https://open.spotify.com/playlist/test',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

export function createTestEssential(overrides?: Partial<Essential>): Essential {
  return {
    id: 'essential-1',
    user_id: 'test-user-id',
    name: 'Test Essential',
    description: 'Test description',
    icon: 'Laptop',
    category: 'gadget',
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}
