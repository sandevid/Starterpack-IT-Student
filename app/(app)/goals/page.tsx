import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Goal, GoalStep, GoalWithSteps } from '@/types/database.types'
import { GoalClient } from '@/components/goals/GoalClient'

export default async function GoalsPage() {
  const supabase = await createClient()
  
  // Fetch user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all goals for user
  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allGoals: Goal[] = goals || []

  // Fetch all goal steps for these goals
  const goalIds = allGoals.map(goal => goal.id)
  
  let allSteps: GoalStep[] = []
  if (goalIds.length > 0) {
    const { data: steps } = await supabase
      .from('goal_steps')
      .select('*')
      .in('goal_id', goalIds)
      .order('created_at', { ascending: true })
    
    allSteps = steps || []
  }

  // Calculate progress for each goal
  const goalsWithSteps: GoalWithSteps[] = allGoals.map(goal => {
    const goalSteps = allSteps.filter(step => step.goal_id === goal.id)
    const completedSteps = goalSteps.filter(step => step.completed).length
    const totalSteps = goalSteps.length
    
    // Calculate progress: (completed / total) * 100, or 0 if no steps
    const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

    return {
      ...goal,
      steps: goalSteps,
      progress,
    }
  })

  return (
    <div className="min-h-screen bg-cream p-6 pb-24">
      <div className="max-w-[430px] mx-auto">
        <GoalClient goals={goalsWithSteps} />
      </div>
    </div>
  )
}
