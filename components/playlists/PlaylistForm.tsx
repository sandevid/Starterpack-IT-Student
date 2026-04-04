'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { playlistSchema, type PlaylistInput } from '@/lib/validations/playlist'
import { Button } from '@/components/ui/Button'
import type { Playlist } from '@/types/database.types'

interface PlaylistFormProps {
  onSubmit: (data: PlaylistInput) => Promise<void>
  onCancel: () => void
  initialData?: Playlist
}

export function PlaylistForm({ onSubmit, onCancel, initialData }: PlaylistFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlaylistInput>({
    resolver: zodResolver(playlistSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || '',
          url: initialData.url,
        }
      : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-space-cadet mb-1">
          Playlist Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-3 py-2 border border-slate-gray/30 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-space-cadet"
          placeholder="My Study Playlist"
        />
        {errors.name && (
          <p className="text-caput text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description Input */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-space-cadet mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-slate-gray/30 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-space-cadet resize-none"
          placeholder="Describe your playlist..."
        />
        {errors.description && (
          <p className="text-caput text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* URL Input */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-space-cadet mb-1">
          Spotify URL
        </label>
        <input
          id="url"
          type="url"
          {...register('url')}
          className="w-full px-3 py-2 border border-slate-gray/30 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-space-cadet"
          placeholder="https://open.spotify.com/playlist/..."
        />
        {errors.url && (
          <p className="text-caput text-sm mt-1">{errors.url.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="flex-1"
        >
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
