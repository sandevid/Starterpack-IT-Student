import { z } from 'zod'

export const calendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  notes: z.string().max(500, 'Notes too long').optional(),
  color: z.enum(['exam', 'deadline', 'event', 'reminder']),
})

export type CalendarEventInput = z.infer<typeof calendarEventSchema>
