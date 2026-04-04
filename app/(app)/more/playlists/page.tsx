import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Playlist } from '@/types/database.types'
import { PlaylistClient } from '@/components/playlists/PlaylistClient'

export default async function PlaylistsPage() {
  const supabase = await createClient()
  
  // Fetch user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all playlists for user
  const { data: playlists } = await supabase
    .from('playlists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allPlaylists: Playlist[] = playlists || []

  return (
    <div className="min-h-screen bg-cream p-6 pb-24">
      <div className="max-w-[430px] mx-auto">
        <PlaylistClient playlists={allPlaylists} />
      </div>
    </div>
  )
}
