'use client'

import { Card } from '@/components/ui/Card'
import { Edit2, Trash2 } from 'lucide-react'
import type { CalendarEvent } from '@/types/database.types'

interface CalendarEventCardProps {
  event: CalendarEvent
  onEdit: (event: CalendarEvent) => void
  onDelete: (id: string) => void
}

const colorMap = {
  exam: 'bg-caput',
  deadline: 'bg-coffee',
  event: 'bg-slate-gray',
  reminder: 'bg-tan',
}

export function CalendarEventCard({ event, onEdit, onDelete }: CalendarEventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card className="flex items-start gap-3">
      <div className={`w-3 h-3 rounded-full mt-1 ${colorMap[event.color]}`} />
      
      <div className="flex-1 min-w-0">
        <h3 className="text-space-cadet font-medium">{event.title}</h3>
        <p className="text-sm text-slate-gray mt-1">{formattedDate}</p>
        {event.notes && (
          <p className="text-sm text-slate-gray mt-2">{event.notes}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(event)}
          className="text-slate-gray hover:text-space-cadet transition-colors"
          aria-label="Edit event"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="text-slate-gray hover:text-caput transition-colors"
          aria-label="Delete event"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </Card>
  )
}
