'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Calendar as CalendarIcon } from 'lucide-react'
import type { CalendarEvent } from '@/types/database.types'

interface CalendarPreviewProps {
  events: CalendarEvent[]
}

export function CalendarPreview({ events }: CalendarPreviewProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-playfair text-space-cadet">Upcoming Events</h2>
        <Link href="/calendar" className="text-sm text-slate-gray hover:text-space-cadet">
          View all
        </Link>
      </div>
      {events.length > 0 ? (
        <div className="space-y-2">
          {events.map((event) => (
            <Card key={event.id} className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  event.color === 'exam'
                    ? 'bg-caput'
                    : event.color === 'deadline'
                    ? 'bg-coffee'
                    : event.color === 'reminder'
                    ? 'bg-tan'
                    : 'bg-slate-gray'
                }`}
              />
              <div className="flex-1">
                <p className="text-space-cadet">{event.title}</p>
                <p className="text-xs text-slate-gray">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-8">
          <EmptyState
            icon={CalendarIcon}
            title="No upcoming events"
            description="Add an event to your calendar"
            action={{
              label: 'Add event',
              onClick: () => {
                window.location.href = '/calendar'
              },
            }}
          />
        </Card>
      )}
    </div>
  )
}
