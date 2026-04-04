'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function setupProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const fullName = formData.get('full_name') as string

  if (!fullName || !fullName.trim()) {
    return { error: 'Full name is required' }
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/')
    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error('Error setting up profile:', error)
    return { error: 'Failed to set up profile' }
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const fullName = formData.get('full_name') as string

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
      })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { error: 'Failed to update profile' }
  }
}

export async function uploadProfileImage(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const file = formData.get('file') as File
  if (!file) {
    return { error: 'No file provided' }
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { error: 'File must be an image' }
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { error: 'File size must be less than 2MB' }
  }

  try {
    // Delete old image if exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single()

    if (profile?.avatar_url) {
      const oldPath = profile.avatar_url.split('/').pop()
      if (oldPath) {
        await supabase.storage
          .from('profiles')
          .remove([`${user.id}/${oldPath}`])
      }
    }

    // Upload new image
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('profiles').getPublicUrl(filePath)

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (updateError) throw updateError

    revalidatePath('/profile')
    return { success: true, url: publicUrl }
  } catch (error) {
    console.error('Error uploading profile image:', error)
    return { error: 'Failed to upload image' }
  }
}

export async function deleteProfileImage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single()

    if (profile?.avatar_url) {
      const oldPath = profile.avatar_url.split('/').pop()
      if (oldPath) {
        await supabase.storage
          .from('profiles')
          .remove([`${user.id}/${oldPath}`])
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', user.id)

    if (error) throw error

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error('Error deleting profile image:', error)
    return { error: 'Failed to delete image' }
  }
}
