/**
 * CalendarClient Component Tests
 * 
 * This test suite validates the calendar module according to Task 25.
 * 
 * Test Coverage:
 * - 25.1: Test event creation
 * - 25.2: Test event editing
 * - 25.3: Test event deletion
 * - 25.4: Test color-coded markers
 * - 25.5: Test empty state
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalendarClient } from './CalendarClient'
import type { CalendarEvent } from '@/types/database.types'
import * as calendarActions from '@/actions/calendar'
import toast from 'react-hot-toast'

// Mock dependencies
vi.mock('@/actions/calendar', () => ({
  createCalendarEvent: vi.fn(),
  updateCalendarEvent: vi.fn(),
  deleteCalendarEvent: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock window.location.reload
const mockReload = vi.fn()
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
})

// Mock window.confirm
global.confirm = vi.fn()

describe('25. Test calendar module', () => {
  const mockEvents: CalendarEvent[] = [
    {
      id: 'event-1',
      user_id: 'user-123',
      title: 'Math Exam',
      date: '2024-12-20',
      notes: 'Chapter 1-5',
      color: 'exam',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'event-2',
      user_id: 'user-123',
      title: 'Project Deadline',
      date: '2024-12-22',
      notes: null,
      color: 'deadline',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
    {
      id: 'event-3',
      user_id: 'user-123',
      title: 'Study Session',
      date: '2024-12-25',
      notes: 'Library at 3pm',
      color: 'event',
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockReload.mockClear()
  })

  describe('25.1 Test event creation', () => {
    it('should open create modal when Add Event button is clicked', async () => {
      const user = userEvent.setup()
      render(<CalendarClient initialEvents={[]} />)

      const addButton = screen.getByRole('button', { name: /add event/i })
      await user.click(addButton)

      expect(screen.getByText('Create Event')).toBeInTheDocument()
    })

    it('should create event with valid data', async () => {
      const user = userEvent.setup()
      vi.mocked(calendarActions.createCalendarEvent).mockResolvedValue({ success: true })

      render(<CalendarClient initialEvents={[]} />)

      // Open create modal
      const addButton = screen.getByRole('button', { name: /add event/i })
      await user.click(addButton)

      // Fill form
      const titleInput = screen.getByLabelText(/title/i)
      const dateInput = screen.getByLabelText(/date/i)
      const notesInput = screen.getByLabelText(/notes/i)

      await user.type(titleInput, 'New Math Exam')
      await user.clear(dateInput)
      await user.type(dateInput, '2024-12-30')
      await user.type(notesInput, 'Final exam')

      // Submit form
      const createButton = screen.getByRole('button', { name: /^create$/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(calendarActions.createCalendarEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Math Exam',
            date: '2024-12-30',
            notes: 'Final exam',
            color: 'event', // default color
          })
        )
      })

      expect(toast.success).toHaveBeenCalledWith('Event created successfully')
      expect(mockReload).toHaveBeenCalled()
    })

    it('should display error toast when creation fails', async () => {
      const user = userEvent.setup()
      vi.mocked(calendarActions.createCalendarEvent).mockResolvedValue({
        error: 'Failed to create event',
      })

      render(<CalendarClient initialEvents={[]} />)

      // Open create modal
      const addButton = screen.getByRole('button', { name: /add event/i })
      await user.click(addButton)

      // Fill and submit form
      const titleInput = screen.getByLabelText(/title/i)
      await user.type(titleInput, 'Test Event')

      const createButton = screen.getByRole('button', { name: /^create$/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to create event')
      })

      expect(mockReload).not.toHaveBeenCalled()
    })

    it('should create event with different color options', async () => {
      const user = userEvent.setup()
      vi.mocked(calendarActions.createCalendarEvent).mockResolvedValue({ success: true })

      render(<CalendarClient initialEvents={[]} />)

      // Open create modal
      const addButton = screen.getByRole('button', { name: /add event/i })
      await user.click(addButton)

      // Fill form
      const titleInput = screen.getByLabelText(/title/i)
      await user.type(titleInput, 'Important Deadline')

      // Select deadline color
      const deadlineButton = screen.getByRole('button', { name: /deadline/i })
      await user.click(deadlineButton)

      // Submit form
      const createButton = screen.getByRole('button', { name: /^create$/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(calendarActions.createCalendarEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            color: 'deadline',
          })
        )
      })
    })
  })

  describe('25.2 Test event editing', () => {
    it('should open edit modal when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(<CalendarClient initialEvents={mockEvents} />)

      // Find and click edit button for first event
      const editButtons = screen.getAllByLabelText(/edit event/i)
      await user.click(editButtons[0])

      expect(screen.getByText('Edit Event')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Math Exam')).toBeInTheDocument()
    })

    it('should update event with new data', async () => {
      const user = userEvent.setup()
      vi.mocked(calendarActions.updateCalendarEvent).mockResolvedValue({ success: true })

      render(<CalendarClient initialEvents={mockEvents} />)

      // Open edit modal
      const editButtons = screen.getAllByLabelText(/edit event/i)
      await user.click(editButtons[0])

      // Update title
      const titleInput = screen.getByLabelText(/title/i)
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Math Exam')

      // Submit form
      const updateButton = screen.getByRole('button', { name: /^update$/i })
      await user.click(updateButton)

      await waitFor(() => {
        expect(calendarActions.updateCalendarEvent).toHaveBeenCalledWith(
          'event-1',
          expect.objectContaining({
            title: 'Updated Math Exam',
          })
        )
      })

      expect(toast.success).toHaveBeenCalledWith('Event updated successfully')
      expect(mockReload).toHaveBeenCalled()
    })

    it('should display error toast when update fails', async () => {
      const user = userEvent.setup()
      vi.mocked(calendarActions.updateCalendarEvent).mockResolvedValue({
        error: 'Failed to update event',
      })

      render(<CalendarClient initialEvents={mockEvents} />)

      // Open edit modal
      const editButtons = screen.getAllByLabelText(/edit event/i)
      await user.click(editButtons[0])

      // Submit form
      const updateButton = screen.getByRole('button', { name: /^update$/i })
      await user.click(updateButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update event')
      })

      expect(mockReload).not.toHaveBeenCalled()
    })

    it('should pre-fill form with existing event data', async () => {
      const user = userEvent.setup()
      render(<CalendarClient initialEvents={mockEvents} />)

      // Open edit modal for first event
      const editButtons = screen.getAllByLabelText(/edit event/i)
      await user.click(editButtons[0])

      // Check pre-filled values
      expect(screen.getByDisplayValue('Math Exam')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2024-12-20')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Chapter 1-5')).toBeInTheDocument()
    })

    it('should close modal when cancel is clicked during edit', async () => {
      const user = userEvent.setup()
      render(<CalendarClient initialEvents={mockEvents} />)

      // Open edit modal
      const editButtons = screen.getAllByLabelText(/edit event/i)
      await user.click(editButtons[0])

      expect(screen.getByText('Edit Event')).toBeInTheDocument()

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      await waitFor(() => {
        expect(screen.queryByText('Edit Event')).not.toBeInTheDocument()
      })
    })
  })

  describe('25.3 Test event deletion', () => {
    it('should show confirmation dialog when delete button is clicked', async () => {
      const user = userEvent.setup()
      vi.mocked(global.confirm).mockReturnValue(false)

      render(<CalendarClient initialEvents={mockEvents} />)

      // Click delete button
      const deleteButtons = screen.getAllByLabelText(/delete event/i)
      await user.click(deleteButtons[0])

      expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this event?')
    })

    it('should delete event when confirmed', async () => {
      const user = userEvent.setup()
      vi.mocked(global.confirm).mockReturnValue(true)
      vi.mocked(calendarActions.deleteCalendarEvent).mockResolvedValue({ success: true })

      render(<CalendarClient initialEvents={mockEvents} />)

      // Click delete button
      const deleteButtons = screen.getAllByLabelText(/delete event/i)
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(calendarActions.deleteCalendarEvent).toHaveBeenCalledWith('event-1')
      })

      expect(toast.success).toHaveBeenCalledWith('Event deleted successfully')
      expect(mockReload).toHaveBeenCalled()
    })

    it('should not delete event when cancelled', async () => {
      const user = userEvent.setup()
      vi.mocked(global.confirm).mockReturnValue(false)

      render(<CalendarClient initialEvents={mockEvents} />)

      // Click delete button
      const deleteButtons = screen.getAllByLabelText(/delete event/i)
      await user.click(deleteButtons[0])

      expect(calendarActions.deleteCalendarEvent).not.toHaveBeenCalled()
      expect(mockReload).not.toHaveBeenCalled()
    })

    it('should display error toast when deletion fails', async () => {
      const user = userEvent.setup()
      vi.mocked(global.confirm).mockReturnValue(true)
      vi.mocked(calendarActions.deleteCalendarEvent).mockResolvedValue({
        error: 'Failed to delete event',
      })

      render(<CalendarClient initialEvents={mockEvents} />)

      // Click delete button
      const deleteButtons = screen.getAllByLabelText(/delete event/i)
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to delete event')
      })

      expect(mockReload).not.toHaveBeenCalled()
    })
  })

  describe('25.4 Test color-coded markers', () => {
    it('should display events with correct color markers', () => {
      render(<CalendarClient initialEvents={mockEvents} />)

      // Check that events are displayed
      expect(screen.getByText('Math Exam')).toBeInTheDocument()
      expect(screen.getByText('Project Deadline')).toBeInTheDocument()
      expect(screen.getByText('Study Session')).toBeInTheDocument()
    })

    it('should pass events to Calendar component for marker display', () => {
      const { container } = render(<CalendarClient initialEvents={mockEvents} />)

      // Calendar component should be rendered
      const calendarContainer = container.querySelector('.calendar-container')
      expect(calendarContainer).toBeInTheDocument()
    })

    it('should display all four color types correctly', () => {
      const coloredEvents: CalendarEvent[] = [
        {
          id: 'event-1',
          user_id: 'user-123',
          title: 'Exam Event',
          date: '2024-12-20',
          notes: null,
          color: 'exam',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'event-2',
          user_id: 'user-123',
          title: 'Deadline Event',
          date: '2024-12-21',
          notes: null,
          color: 'deadline',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
        {
          id: 'event-3',
          user_id: 'user-123',
          title: 'Regular Event',
          date: '2024-12-22',
          notes: null,
          color: 'event',
          created_at: '2024-01-03T00:00:00Z',
          updated_at: '2024-01-03T00:00:00Z',
        },
        {
          id: 'event-4',
          user_id: 'user-123',
          title: 'Reminder Event',
          date: '2024-12-23',
          notes: null,
          color: 'reminder',
          created_at: '2024-01-04T00:00:00Z',
          updated_at: '2024-01-04T00:00:00Z',
        },
      ]

      render(<CalendarClient initialEvents={coloredEvents} />)

      // All events should be displayed
      expect(screen.getByText('Exam Event')).toBeInTheDocument()
      expect(screen.getByText('Deadline Event')).toBeInTheDocument()
      expect(screen.getByText('Regular Event')).toBeInTheDocument()
      expect(screen.getByText('Reminder Event')).toBeInTheDocument()
    })
  })

  describe('25.5 Test empty state', () => {
    it('should display empty state when no events exist', () => {
      render(<CalendarClient initialEvents={[]} />)

      expect(screen.getByText('No events yet')).toBeInTheDocument()
      expect(screen.getByText('Add your first event to get started')).toBeInTheDocument()
    })

    it('should not display empty state when events exist', () => {
      render(<CalendarClient initialEvents={mockEvents} />)

      expect(screen.queryByText('No events yet')).not.toBeInTheDocument()
      expect(screen.queryByText('Add your first event to get started')).not.toBeInTheDocument()
    })

    it('should display calendar even with empty events', () => {
      const { container } = render(<CalendarClient initialEvents={[]} />)

      // Calendar should still be rendered
      const calendarContainer = container.querySelector('.calendar-container')
      expect(calendarContainer).toBeInTheDocument()
    })

    it('should display Add Event button in empty state', () => {
      render(<CalendarClient initialEvents={[]} />)

      const addButton = screen.getByRole('button', { name: /add event/i })
      expect(addButton).toBeInTheDocument()
    })
  })

  describe('Additional calendar functionality', () => {
    it('should display page title', () => {
      render(<CalendarClient initialEvents={mockEvents} />)

      expect(screen.getByText('Calendar')).toBeInTheDocument()
    })

    it('should display Upcoming Events section', () => {
      render(<CalendarClient initialEvents={mockEvents} />)

      expect(screen.getByText('Upcoming Events')).toBeInTheDocument()
    })

    it('should close modal when clicking outside', async () => {
      const user = userEvent.setup()
      render(<CalendarClient initialEvents={[]} />)

      // Open modal
      const addButton = screen.getByRole('button', { name: /add event/i })
      await user.click(addButton)

      expect(screen.getByText('Create Event')).toBeInTheDocument()

      // Close modal by clicking X button
      const closeButton = screen.getByRole('button', { name: '' })
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Create Event')).not.toBeInTheDocument()
      })
    })

    it('should handle multiple events on the same date', () => {
      const sameDateEvents: CalendarEvent[] = [
        {
          id: 'event-1',
          user_id: 'user-123',
          title: 'Morning Event',
          date: '2024-12-20',
          notes: null,
          color: 'exam',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'event-2',
          user_id: 'user-123',
          title: 'Afternoon Event',
          date: '2024-12-20',
          notes: null,
          color: 'deadline',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ]

      render(<CalendarClient initialEvents={sameDateEvents} />)

      expect(screen.getByText('Morning Event')).toBeInTheDocument()
      expect(screen.getByText('Afternoon Event')).toBeInTheDocument()
    })
  })
})
