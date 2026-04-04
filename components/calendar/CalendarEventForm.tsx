'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { calendarEventSchema, type CalendarEventInput } from '@/lib/validations/calendar'
import { Button } from '@/components/ui/Button'
import { format } from 'date-fns'
import { useState } from 'react'
import type { CalendarEvent } from '@/types/database.types'

interface CalendarEventFormProps {
  onSubmit: (data: CalendarEventInput) => Promise<void>
  onCancel: () => void
  initialData?: CalendarEvent
}

const colorOptions = [
  { value: 'exam', label: 'Exam', color: 'bg-red-500' },
  { value: 'deadline', label: 'Deadline', color: 'bg-coffee' },
  { value: 'event', label: 'Event', color: 'bg-slate-gray' },
  { value: 'reminder', label: 'Reminder', color: 'bg-tan' },
] as const

export function CalendarEventForm({ onSubmit, onCancel, initialData }: CalendarEventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CalendarEventInput>({
    resolver: zodResolver(calendarEventSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          date: initialData.date,
          notes: initialData.notes || '',
          color: initialData.color,
        }
      : {
          title: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          notes: '',
          color: 'event',
        },
  })

  const selectedColor = watch('color')

  const handleFormSubmit = async (data: CalendarEventInput) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-space-cadet mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-4 py-2 border border-slate-gray/30 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-space-cadet"
          placeholder="Enter event title"
        />
        {errors.title && (
          <p className="text-caput text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Date Picker Input */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-space-cadet mb-1">
          Date
        </label>
        <input
          id="date"
          type="date"
          {...register('date')}
          className="w-full px-4 py-2 border border-slate-gray/30 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-space-cadet"
        />
        {errors.date && (
          <p className="text-caput text-sm mt-1">{errors.date.message}</p>
        )}
      </div>

      {/* Color Selector */}
      <div>
        <label className="block text-sm font-medium text-space-cadet mb-2">
          Color
        </label>
        <div className="grid grid-cols-2 gap-2">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue('color', option.value)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-[10px] transition-colors ${
                selectedColor === option.value
                  ? 'border-space-cadet bg-space-cadet/5'
                  : 'border-slate-gray/30 hover:border-slate-gray/50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${option.color}`} />
              <span className="text-sm text-space-cadet">{option.label}</span>
            </button>
          ))}
        </div>
        {errors.color && (
          <p className="text-caput text-sm mt-1">{errors.color.message}</p>
        )}
      </div>

      {/* Notes Textarea */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-space-cadet mb-1">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={4}
          className="w-full px-4 py-2 border border-slate-gray/30 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-space-cadet resize-none"
          placeholder="Add any additional notes..."
        />
        {errors.notes && (
          <p className="text-caput text-sm mt-1">{errors.notes.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="flex-1"
        >
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
