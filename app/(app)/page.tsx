import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Greeting } from '@/components/dashboard/Greeting'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { TodoPreview } from '@/components/dashboard/TodoPreview'
import { CalendarPreview } from '@/components/dashboard/CalendarPreview'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch dashboard statistics
  const { count: todoCount } = await supabase
    .from('todos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('completed', false)

  const { count: goalCount } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: eventCount } = await supabase
    .from('calendar_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('date', new Date().toISOString().split('T')[0])

  // Fetch preview data (5 todos, 3 events)
  const { data: previewTodos } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .eq('completed', false)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: previewEvents } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(3)

  return (
    <div className="min-h-screen bg-cream p-6 pb-24">
      <div className="max-w-[430px] mx-auto">
        <Greeting fullName={profile?.full_name || null} avatarUrl={profile?.avatar_url || null} />
        <StatsCards todoCount={todoCount || 0} goalCount={goalCount || 0} eventCount={eventCount || 0} />
        <TodoPreview todos={previewTodos || []} />
        <CalendarPreview events={previewEvents || []} />
      </div>
    </div>
  )
}
