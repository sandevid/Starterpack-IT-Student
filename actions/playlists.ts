'use server'

import { createClient } from '@/lib/supabase/server'
import { playlistSchema, type PlaylistInput } from '@/lib/validations/playlist'
import { revalidatePath } from 'next/cache'

export async function createPlaylist(data: PlaylistInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const validatedFields = playlistSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from('playlists').insert({
    user_id: user.id,
    ...validatedFields.data,
  })

  if (error) {
    return { error: 'Failed to create playlist' }
  }

  revalidatePath('/more/playlists')
  return { success: true }
}

export async function updatePlaylist(id: string, data: PlaylistInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const validatedFields = playlistSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('playlists')
    .update(validatedFields.data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to update playlist' }
  }

  revalidatePath('/more/playlists')
  return { success: true }
}

export async function deletePlaylist(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('playlists')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Failed to delete playlist' }
  }

  revalidatePath('/more/playlists')
  return { success: true }
}
