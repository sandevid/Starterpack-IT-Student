import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Todo } from '@/types/database.types'
import { TodoClient } from '@/components/tasks/TodoClient'

export default async function TasksPage() {
  const supabase = await createClient()
  
  // Fetch user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all todos for user
  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allTodos: Todo[] = todos || []

  // Separate todos by completion status
  const inProgressTodos = allTodos.filter(todo => !todo.completed)
  const completedTodos = allTodos.filter(todo => todo.completed)

  return (
    <div className="min-h-screen bg-cream p-6 pb-24">
      <div className="max-w-[430px] mx-auto">
        <TodoClient 
          inProgressTodos={inProgressTodos}
          completedTodos={completedTodos}
        />
      </div>
    </div>
  )
}
