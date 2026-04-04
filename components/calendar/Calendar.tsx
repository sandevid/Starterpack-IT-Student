'use client'

import { DayPicker } from 'react-day-picker'
import { useState, useMemo } from 'react'
import type { CalendarEvent, EventColor } from '@/types/database.types'

interface CalendarProps {
  events: CalendarEvent[]
  onDateSelect?: (date: Date | undefined) => void
}

// Color mapping for event types
const colorMap: Record<EventColor, string> = {
  exam: '#632024', // red (caput)
  deadline: '#6F4D38', // brown (coffee)
  event: '#617891', // gray (slate-gray)
  reminder: '#D5B893', // tan
}

export function Calendar({ events, onDateSelect }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  // Create a map of dates to their event colors
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventColor[]>()
    events.forEach((event) => {
      const dateKey = new Date(event.date).toISOString().split('T')[0]
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey)!.push(event.color)
    })
    return map
  }, [events])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  // Custom Day component to show color markers
  const CustomDay = (props: any) => {
    const { day, modifiers, ...buttonProps } = props
    const date = day.date
    const dateKey = date.toISOString().split('T')[0]
    const dayEvents = eventsByDate.get(dateKey) || []
    
    // Get unique colors for this date
    const uniqueColors = Array.from(new Set(dayEvents))

    return (
      <td className="rdp-cell" role="presentation">
        <button {...buttonProps}>
          <span>{date.getDate()}</span>
          {uniqueColors.length > 0 && (
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
              {uniqueColors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: colorMap[color] }}
                />
              ))}
            </div>
          )}
        </button>
      </td>
    )
  }

  return (
    <div className="bg-white rounded-[14px] p-4 shadow-sm calendar-container overflow-hidden">
      <style jsx global>{`
        .calendar-container .rdp {
          --rdp-accent-color: #25344f;
          --rdp-background-color: #f5f0e8;
          margin: 0 !important;
          width: 100% !important;
        }
        
        .calendar-container .rdp-root {
          width: 100% !important;
        }
        
        .calendar-container .rdp-month {
          width: 100% !important;
        }
        
        .calendar-container .rdp-months {
          width: 100% !important;
        }
        
        .calendar-container .rdp-caption {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 0.5rem 0 1rem 0 !important;
          position: relative !important;
          flex-wrap: nowrap !important;
          gap: 0.5rem !important;
        }
        
        .calendar-container .rdp-caption_label {
          font-family: var(--font-playfair) !important;
          font-size: 1rem !important;
          color: #25344f !important;
          font-weight: 600 !important;
          flex: 1 !important;
          text-align: center !important;
          min-width: 0 !important;
        }
        
        .calendar-container .rdp-nav {
          display: contents !important;
          position: static !important;
        }
        
        .calendar-container .rdp-button_previous {
          order: -1 !important;
          flex-shrink: 0 !important;
        }
        
        .calendar-container .rdp-button_next {
          order: 1 !important;
          flex-shrink: 0 !important;
        }
        
        .calendar-container .rdp-button {
          border: none !important;
          background: none !important;
          cursor: pointer !important;
          color: #617891 !important;
          padding: 0.25rem !important;
          width: 2rem !important;
          height: 2rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        .calendar-container .rdp-button:hover {
          color: #25344f !important;
        }
        
        .calendar-container .rdp-month_grid {
          width: 100% !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
        }
        
        .calendar-container .rdp-weekdays {
          width: 100% !important;
        }
        
        .calendar-container .rdp-head_row {
          width: 100% !important;
        }
        
        .calendar-container .rdp-head_cell {
          font-size: 0.7rem !important;
          font-weight: 600 !important;
          color: #617891 !important;
          text-align: center !important;
          padding: 0.4rem 0 !important;
          width: 14.28% !important;
        }
        
        .calendar-container .rdp-cell {
          text-align: center !important;
          padding: 0.15rem !important;
          position: relative !important;
          width: 14.28% !important;
        }
        
        .calendar-container .rdp-day {
          width: 100% !important;
          aspect-ratio: 1 !important;
          max-width: 2.5rem !important;
          max-height: 2.5rem !important;
          border-radius: 0.5rem !important;
          font-size: 0.8rem !important;
          color: #25344f !important;
          border: none !important;
          background: none !important;
          cursor: pointer !important;
          position: relative !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 0 auto !important;
        }
        
        .calendar-container .rdp-day:hover:not(.rdp-day_disabled) {
          background-color: #f5f0e8 !important;
        }
        
        .calendar-container .rdp-day_selected {
          background-color: #25344f !important;
          color: #f5f0e8 !important;
        }
        
        .calendar-container .rdp-day_today {
          font-weight: 700 !important;
        }
        
        .calendar-container .rdp-day_outside {
          color: #617891 !important;
          opacity: 0.5 !important;
        }
        
        .calendar-container .rdp-day_disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }
        
        .calendar-container .rdp-weeks {
          width: 100% !important;
        }
        
        .calendar-container .rdp-week {
          width: 100% !important;
        }
      `}</style>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        components={{
          Day: CustomDay,
        }}
      />
      
      {/* Event color legend - shown below calendar */}
      <div className="mt-4 pt-4 border-t border-slate-gray/20">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(colorMap).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-slate-gray capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
