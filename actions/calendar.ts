'use server'

import { createClient } from '@/lib/supabase/server'
import { calendarEventSchema, type CalendarEventInput } from '@/lib/validations/calendar'
import { revalidatePath } from 'next/cache'

export async function createCalendarEvent(data: CalendarEventInput | FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Handle both FormData and direct object input
  const inputData = data instanceof FormData
    ? {
        title: data.get('title'),
        date: data.get('date'),
        notes: data.get('notes') || undefined,
        color: data.get('color'),
      }
    : data

  const validatedFields = calendarEventSchema.safeParse(inputData)

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.issues }
  }

  const { error } = await supabase.from('calendar_events').insert({
    user_id: user.id,
    ...validatedFields.data,
  })

  if (error) {
    return { error: 'Failed to create event' }
  }

  revalidatePath('/calendar')
  revalidatePath('/')
  return { success: true }
}

export async function updateCalendarEvent(id: string, data: CalendarEventInput | FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Handle both FormData and direct object input
  const inputData = data instanceof FormData
    ? {
        title: data.get('title'),
        date: data.get('date'),
        notes: data.get('notes') || undefined,
        color: data.get('color'),
      }
    : data

  const validatedFields = calendarEventSchema.safeParse(inputData)

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.issues }
  }

  const { error } = await supabase
    .from('calendar_events')
    .update(validatedFields.data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to update event' }
  }

  revalidatePath('/calendar')
  revalidatePath('/')
  return { success: true }
}

export async function deleteCalendarEvent(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to delete event' }
  }

  revalidatePath('/calendar')
  revalidatePath('/')
  return { success: true }
}
