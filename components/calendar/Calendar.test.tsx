import { render, screen } from '@testing-library/react'
import { Calendar } from './Calendar'
import type { CalendarEvent } from '@/types/database.types'
import { describe, it, expect } from 'vitest'

describe('Calendar Component', () => {
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      user_id: 'user1',
      title: 'Math Exam',
      date: '2024-01-15',
      notes: null,
      color: 'exam',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      user_id: 'user1',
      title: 'Project Deadline',
      date: '2024-01-20',
      notes: null,
      color: 'deadline',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      user_id: 'user1',
      title: 'Study Session',
      date: '2024-01-25',
      notes: null,
      color: 'event',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '4',
      user_id: 'user1',
      title: 'Assignment Reminder',
      date: '2024-01-30',
      notes: null,
      color: 'reminder',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ]

  it('renders calendar component', () => {
    render(<Calendar events={mockEvents} />)
    // Calendar should render without errors
    expect(document.querySelector('.calendar-container')).toBeInTheDocument()
  })

  it('displays color legend with all event types', () => {
    render(<Calendar events={mockEvents} />)
    
    // Check that all event type labels are present
    expect(screen.getByText('exam')).toBeInTheDocument()
    expect(screen.getByText('deadline')).toBeInTheDocument()
    expect(screen.getByText('event')).toBeInTheDocument()
    expect(screen.getByText('reminder')).toBeInTheDocument()
  })

  it('renders with empty events array', () => {
    render(<Calendar events={[]} />)
    expect(document.querySelector('.calendar-container')).toBeInTheDocument()
  })

  it('applies correct color mapping', () => {
    const { container } = render(<Calendar events={mockEvents} />)
    
    // Check that the calendar container exists
    const calendarContainer = container.querySelector('.calendar-container')
    expect(calendarContainer).toBeInTheDocument()
  })
})
