import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { CalendarEvent } from '@/types/database.types'
import { CalendarClient } from '@/components/calendar/CalendarClient'

export default async function CalendarPage() {
  const supabase = await createClient()
  
  // Fetch user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all calendar events for user
  const { data: events } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  const calendarEvents: CalendarEvent[] = events || []

  return (
    <div className="min-h-screen bg-cream p-6 pb-24">
      <div className="max-w-[430px] mx-auto">
        <CalendarClient initialEvents={calendarEvents} />
      </div>
    </div>
  )
}
