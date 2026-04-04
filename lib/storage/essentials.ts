import { createClient } from '@/lib/supabase/client'

export async function uploadEssentialImage(file: File, userId: string): Promise<string> {
  const supabase = createClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  // Upload file to Supabase Storage
  const { data, error } = await supabase.storage
    .from('essential-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('essential-images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function deleteEssentialImage(imageUrl: string): Promise<void> {
  const supabase = createClient()

  // Extract path from URL
  const url = new URL(imageUrl)
  const pathParts = url.pathname.split('/essential-images/')
  if (pathParts.length < 2) return

  const filePath = pathParts[1]

  // Delete file from storage
  const { error } = await supabase.storage
    .from('essential-images')
    .remove([filePath])

  if (error) {
    console.error('Failed to delete image:', error)
  }
}
