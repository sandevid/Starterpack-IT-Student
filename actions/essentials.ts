'use server'

import { createClient } from '@/lib/supabase/server'
import { essentialSchema, type EssentialInput } from '@/lib/validations/essential'
import { revalidatePath } from 'next/cache'

export async function createEssential(data: EssentialInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const validatedFields = essentialSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from('essentials').insert({
    user_id: user.id,
    ...validatedFields.data,
    image_url: validatedFields.data.image_url || null,
  })

  if (error) {
    return { error: 'Failed to create essential' }
  }

  revalidatePath('/more/essentials')
  return { success: true }
}

export async function updateEssential(id: string, data: EssentialInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const validatedFields = essentialSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('essentials')
    .update({
      ...validatedFields.data,
      image_url: validatedFields.data.image_url || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to update essential' }
  }

  revalidatePath('/more/essentials')
  return { success: true }
}

export async function deleteEssential(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('essentials')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to delete essential' }
  }

  revalidatePath('/more/essentials')
  return { success: true }
}
