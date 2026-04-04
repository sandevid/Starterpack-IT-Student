// Type unions for database enums
export type EventColor = 'exam' | 'deadline' | 'event' | 'reminder'
export type TodoTag = 'math' | 'english' | 'science' | 'ipa' | 'ips' | 'general'
export type EssentialIcon =
  | 'Laptop'
  | 'Headphones'
  | 'BookOpen'
  | 'Pen'
  | 'Backpack'
  | 'Watch'
  | 'Glasses'
  | 'Coffee'
  | 'Package'
  | 'Star'
export type EssentialCategory = 'gadget' | 'stationery' | 'fashion' | 'book' | 'general'

// Database entity interfaces
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface CalendarEvent {
  id: string
  user_id: string
  title: string
  date: string
  notes: string | null
  color: EventColor
  created_at: string
  updated_at: string
}

export interface Todo {
  id: string
  user_id: string
  title: string
  completed: boolean
  tag: TodoTag
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface GoalStep {
  id: string
  goal_id: string
  title: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface Playlist {
  id: string
  user_id: string
  name: string
  description: string | null
  url: string
  created_at: string
  updated_at: string
}

export interface Essential {
  id: string
  user_id: string
  name: string
  description: string | null
  icon: EssentialIcon
  category: EssentialCategory
  image_url: string | null
  created_at: string
  updated_at: string
}

// Extended types with relations
export interface GoalWithSteps extends Goal {
  steps: GoalStep[]
  progress: number
}
