'use server'

import { createClient } from '@/lib/supabase/server'
import { goalSchema, goalStepSchema, type GoalInput, type GoalStepInput } from '@/lib/validations/goal'
import { revalidatePath } from 'next/cache'

export async function createGoal(data: GoalInput | FormData) {
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
      }
    : data

  const validatedFields = goalSchema.safeParse(inputData)

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.issues }
  }

  const { error } = await supabase.from('goals').insert({
    user_id: user.id,
    ...validatedFields.data,
  })

  if (error) {
    return { error: 'Failed to create goal' }
  }

  revalidatePath('/goals')
  revalidatePath('/')
  return { success: true }
}

export async function updateGoal(id: string, data: GoalInput | FormData) {
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
      }
    : data

  const validatedFields = goalSchema.safeParse(inputData)

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.issues }
  }

  const { error } = await supabase
    .from('goals')
    .update(validatedFields.data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to update goal' }
  }

  revalidatePath('/goals')
  revalidatePath('/')
  return { success: true }
}

export async function deleteGoal(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Database cascade delete will automatically remove associated goal_steps
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to delete goal' }
  }

  revalidatePath('/goals')
  revalidatePath('/')
  return { success: true }
}

export async function createGoalStep(data: GoalStepInput | FormData) {
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
        goal_id: data.get('goal_id'),
      }
    : data

  const validatedFields = goalStepSchema.safeParse(inputData)

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.issues }
  }

  // Verify the goal belongs to the user
  const { data: goal, error: goalError } = await supabase
    .from('goals')
    .select('id')
    .eq('id', validatedFields.data.goal_id)
    .eq('user_id', user.id)
    .single()

  if (goalError || !goal) {
    return { error: 'Goal not found or unauthorized' }
  }

  const { error } = await supabase.from('goal_steps').insert({
    completed: false,
    ...validatedFields.data,
  })

  if (error) {
    return { error: 'Failed to create goal step' }
  }

  revalidatePath('/goals')
  revalidatePath('/')
  return { success: true }
}

export async function toggleGoalStep(id: string, completed: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify the goal step belongs to a goal owned by the user
  const { data: goalStep, error: stepError } = await supabase
    .from('goal_steps')
    .select('goal_id, goals!inner(user_id)')
    .eq('id', id)
    .single()

  if (stepError || !goalStep) {
    return { error: 'Goal step not found' }
  }

  // TypeScript type assertion for the joined data
  const goalData = goalStep.goals as unknown as { user_id: string }
  
  if (goalData.user_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('goal_steps')
    .update({ completed })
    .eq('id', id)

  if (error) {
    return { error: 'Failed to toggle goal step' }
  }

  revalidatePath('/goals')
  revalidatePath('/')
  return { success: true }
}

export async function deleteGoalStep(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify the goal step belongs to a goal owned by the user
  const { data: goalStep, error: stepError } = await supabase
    .from('goal_steps')
    .select('goal_id, goals!inner(user_id)')
    .eq('id', id)
    .single()

  if (stepError || !goalStep) {
    return { error: 'Goal step not found' }
  }

  // TypeScript type assertion for the joined data
  const goalData = goalStep.goals as unknown as { user_id: string }
  
  if (goalData.user_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('goal_steps')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: 'Failed to delete goal step' }
  }

  revalidatePath('/goals')
  revalidatePath('/')
  return { success: true }
}
