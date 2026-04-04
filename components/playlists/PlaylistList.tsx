'use client'

import type { Playlist } from '@/types/database.types'
import { PlaylistCard } from './PlaylistCard'

interface PlaylistListProps {
  playlists: Playlist[]
  onEdit?: (playlist: Playlist) => void
  onDelete?: (id: string) => Promise<void>
}

export function PlaylistList({ playlists, onEdit, onDelete }: PlaylistListProps) {
  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-gray">No playlists yet. Add your first study playlist!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {playlists.map(playlist => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
