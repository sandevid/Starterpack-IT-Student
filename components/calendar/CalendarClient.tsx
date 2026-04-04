'use client'

import { useState } from 'react'
import { Calendar } from './Calendar'
import { CalendarEventList } from './CalendarEventList'
import { CalendarEventForm } from './CalendarEventForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import type { CalendarEvent } from '@/types/database.types'
import type { CalendarEventInput } from '@/lib/validations/calendar'
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '@/actions/calendar'

interface CalendarClientProps {
  initialEvents: CalendarEvent[]
}

export function CalendarClient({ initialEvents }: CalendarClientProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  const handleCreate = async (data: CalendarEventInput) => {
    const result = await createCalendarEvent(data)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Event created successfully')
    setIsModalOpen(false)
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleUpdate = async (data: CalendarEventInput) => {
    if (!editingEvent) return

    const result = await updateCalendarEvent(editingEvent.id, data)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Event updated successfully')
    setIsModalOpen(false)
    setEditingEvent(null)
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return
    }

    const result = await deleteCalendarEvent(id)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Event deleted successfully')
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
  }

  const handleOpenCreateModal = () => {
    setEditingEvent(null)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-playfair text-space-cadet">Calendar</h1>
        <Button onClick={handleOpenCreateModal} className="flex items-center gap-2">
          <Plus size={20} />
          Add Event
        </Button>
      </div>

      <div className="space-y-6">
        <Calendar events={events} />
        
        <div>
          <h2 className="text-lg font-playfair text-space-cadet mb-4">Upcoming Events</h2>
          <CalendarEventList
            events={events}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvent ? 'Edit Event' : 'Create Event'}
      >
        <CalendarEventForm
          onSubmit={editingEvent ? handleUpdate : handleCreate}
          onCancel={handleCloseModal}
          initialData={editingEvent || undefined}
        />
      </Modal>
    </>
  )
}
