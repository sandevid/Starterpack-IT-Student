'use client'

import { Music } from 'lucide-react'
import type { Playlist } from '@/types/database.types'
import { Card } from '@/components/ui/Card'

interface PlaylistCardProps {
  playlist: Playlist
  onEdit?: (playlist: Playlist) => void
  onDelete?: (id: string) => Promise<void>
}

export function PlaylistCard({ playlist, onEdit, onDelete }: PlaylistCardProps) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        {/* Music Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-space-cadet/10 rounded-[10px] flex items-center justify-center">
          <Music size={24} className="text-space-cadet" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-space-cadet mb-1">
            {playlist.name}
          </h3>
          {playlist.description && (
            <p className="text-sm text-slate-gray mb-3 line-clamp-2">
              {playlist.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <a
              href={playlist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-space-cadet text-cream rounded-[10px] text-sm font-medium hover:bg-space-cadet/90 text-center"
            >
              Open Spotify
            </a>
            <button
              onClick={() => onEdit?.(playlist)}
              className="px-3 py-2 bg-slate-gray text-cream rounded-[10px] text-sm font-medium hover:bg-slate-gray/90"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(playlist.id)}
              className="px-3 py-2 bg-caput text-cream rounded-[10px] text-sm font-medium hover:bg-caput/90"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
