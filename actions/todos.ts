'use server'

import { createClient } from '@/lib/supabase/server'
import { todoSchema, type TodoInput } from '@/lib/validations/todo'
import { revalidatePath } from 'next/cache'

export async function createTodo(data: TodoInput | FormData) {
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
        tag: data.get('tag'),
      }
    : data

  const validatedFields = todoSchema.safeParse(inputData)

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.issues }
  }

  const { error } = await supabase.from('todos').insert({
    user_id: user.id,
    completed: false,
    ...validatedFields.data,
  })

  if (error) {
    return { error: 'Failed to create todo' }
  }

  revalidatePath('/tasks')
  revalidatePath('/')
  return { success: true }
}

export async function updateTodo(id: string, data: TodoInput | FormData) {
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
        tag: data.get('tag'),
      }
    : data

  const validatedFields = todoSchema.safeParse(inputData)

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.issues }
  }

  const { error } = await supabase
    .from('todos')
    .update(validatedFields.data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to update todo' }
  }

  revalidatePath('/tasks')
  revalidatePath('/')
  return { success: true }
}

export async function toggleTodo(id: string, completed: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('todos')
    .update({ completed })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to toggle todo' }
  }

  revalidatePath('/tasks')
  revalidatePath('/')
  return { success: true }
}

export async function deleteTodo(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to delete todo' }
  }

  revalidatePath('/tasks')
  revalidatePath('/')
  return { success: true }
}
