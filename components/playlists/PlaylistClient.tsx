'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Music } from 'lucide-react'
import type { Playlist } from '@/types/database.types'
import type { PlaylistInput } from '@/lib/validations/playlist'
import { createPlaylist, updatePlaylist, deletePlaylist } from '@/actions/playlists'
import { PlaylistList } from './PlaylistList'
import { PlaylistForm } from './PlaylistForm'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'

interface PlaylistClientProps {
  playlists: Playlist[]
}

export function PlaylistClient({ playlists }: PlaylistClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null)

  const handleCreatePlaylist = async (data: PlaylistInput) => {
    const result = await createPlaylist(data)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Playlist created successfully')
    setIsModalOpen(false)
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleUpdatePlaylist = async (data: PlaylistInput) => {
    if (!editingPlaylist) return

    const result = await updatePlaylist(editingPlaylist.id, data)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Playlist updated successfully')
    setIsModalOpen(false)
    setEditingPlaylist(null)
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleDeletePlaylist = async (id: string) => {
    const result = await deletePlaylist(id)
    
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Playlist deleted successfully')
    
    // Refresh the page to get updated data
    window.location.reload()
  }

  const handleOpenCreateModal = () => {
    setEditingPlaylist(null)
    setIsModalOpen(true)
  }

  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPlaylist(null)
  }

  return (
    <>
      <PageHeader
        title="Study Playlists"
        action={{
          label: 'Add Playlist',
          onClick: handleOpenCreateModal,
        }}
      />

      {playlists.length === 0 ? (
        <EmptyState
          icon={Music}
          title="No playlists yet"
          description="Add your favorite Spotify playlists to help you focus while studying"
          action={{
            label: 'Add Playlist',
            onClick: handleOpenCreateModal,
          }}
        />
      ) : (
        <PlaylistList
          playlists={playlists}
          onEdit={handleEditPlaylist}
          onDelete={handleDeletePlaylist}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPlaylist ? 'Edit Playlist' : 'Add Playlist'}
      >
        <PlaylistForm
          onSubmit={editingPlaylist ? handleUpdatePlaylist : handleCreatePlaylist}
          onCancel={handleCloseModal}
          initialData={editingPlaylist || undefined}
        />
      </Modal>
    </>
  )
}
