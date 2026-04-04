'use client'

import { CalendarEventCard } from './CalendarEventCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Calendar as CalendarIcon } from 'lucide-react'
import type { CalendarEvent } from '@/types/database.types'

interface CalendarEventListProps {
  events: CalendarEvent[]
  onEdit: (event: CalendarEvent) => void
  onDelete: (id: string) => void
}

export function CalendarEventList({ events, onEdit, onDelete }: CalendarEventListProps) {
  // Sort events by date (ascending)
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  if (sortedEvents.length === 0) {
    return (
      <EmptyState
        icon={CalendarIcon}
        title="No events yet"
        description="Add your first event to get started"
      />
    )
  }

  return (
    <div className="space-y-3">
      {sortedEvents.map((event) => (
        <CalendarEventCard
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
