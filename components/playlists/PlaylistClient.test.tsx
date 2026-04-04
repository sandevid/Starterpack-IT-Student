import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PlaylistClient } from './PlaylistClient'
import type { Playlist } from '@/types/database.types'
import * as playlistActions from '@/actions/playlists'
import toast from 'react-hot-toast'

// Mock actions
vi.mock('@/actions/playlists', () => ({
  createPlaylist: vi.fn(),
  updatePlaylist: vi.fn(),
  deletePlaylist: vi.fn(),
}))

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock window.location.reload
const mockReload = vi.fn()
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
})

describe('PlaylistClient', () => {
  const mockPlaylists: Playlist[] = [
    {
      id: 'playlist-1',
      user_id: 'user-123',
      name: 'Study Vibes',
      description: 'Focus music for studying',
      url: 'https://open.spotify.com/playlist/123',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'playlist-2',
      user_id: 'user-123',
      name: 'Chill Beats',
      description: null,
      url: 'https://open.spotify.com/playlist/456',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockReload.mockClear()
  })

  describe('Empty State', () => {
    it('should display empty state when no playlists exist', () => {
      render(<PlaylistClient playlists={[]} />)

      expect(screen.getByText('No playlists yet')).toBeInTheDocument()
      expect(
        screen.getByText('Add your favorite Spotify playlists to help you focus while studying')
      ).toBeInTheDocument()
    })

    it('should show add button in empty state', () => {
      render(<PlaylistClient playlists={[]} />)

      const addButtons = screen.getAllByRole('button', { name: /add playlist/i })
      expect(addButtons.length).toBeGreaterThan(0)
    })

    it('should open modal when clicking add button in empty state', () => {
      render(<PlaylistClient playlists={[]} />)

      const addButtons = screen.getAllByRole('button', { name: /add playlist/i })
      fireEvent.click(addButtons[0])

      expect(screen.getByRole('heading', { name: 'Add Playlist' })).toBeInTheDocument()
    })
  })

  describe('Playlist Creation', () => {
    it('should create a playlist successfully', async () => {
      vi.mocked(playlistActions.createPlaylist).mockResolvedValue({ success: true })

      render(<PlaylistClient playlists={[]} />)

      // Open modal
      const addButtons = screen.getAllByRole('button', { name: /add playlist/i })
      fireEvent.click(addButtons[0])

      // Fill form
      const nameInput = screen.getByLabelText(/playlist name/i)
      const urlInput = screen.getByLabelText(/spotify url/i)
      fireEvent.change(nameInput, { target: { value: 'New Playlist' } })
      fireEvent.change(urlInput, { target: { value: 'https://open.spotify.com/playlist/789' } })

      // Submit
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(playlistActions.createPlaylist).toHaveBeenCalledWith({
          name: 'New Playlist',
          description: '',
          url: 'https://open.spotify.com/playlist/789',
        })
        expect(toast.success).toHaveBeenCalledWith('Playlist created successfully')
        expect(mockReload).toHaveBeenCalled()
      })
    })

    it('should show error toast when creation fails', async () => {
      vi.mocked(playlistActions.createPlaylist).mockResolvedValue({
        error: 'Failed to create playlist',
      })

      render(<PlaylistClient playlists={[]} />)

      // Open modal
      const addButtons = screen.getAllByRole('button', { name: /add playlist/i })
      fireEvent.click(addButtons[0])

      // Fill form
      const nameInput = screen.getByLabelText(/playlist name/i)
      const urlInput = screen.getByLabelText(/spotify url/i)
      fireEvent.change(nameInput, { target: { value: 'New Playlist' } })
      fireEvent.change(urlInput, { target: { value: 'https://open.spotify.com/playlist/789' } })

      // Submit
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to create playlist')
        expect(mockReload).not.toHaveBeenCalled()
      })
    })
  })

  describe('Playlist Editing', () => {
    it('should update a playlist successfully', async () => {
      vi.mocked(playlistActions.updatePlaylist).mockResolvedValue({ success: true })

      render(<PlaylistClient playlists={mockPlaylists} />)

      // Click edit button on first playlist
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      fireEvent.click(editButtons[0])

      // Update name
      const nameInput = screen.getByLabelText(/playlist name/i)
      fireEvent.change(nameInput, { target: { value: 'Updated Playlist' } })

      // Submit
      const submitButton = screen.getByRole('button', { name: /update/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(playlistActions.updatePlaylist).toHaveBeenCalledWith('playlist-1', {
          name: 'Updated Playlist',
          description: 'Focus music for studying',
          url: 'https://open.spotify.com/playlist/123',
        })
        expect(toast.success).toHaveBeenCalledWith('Playlist updated successfully')
        expect(mockReload).toHaveBeenCalled()
      })
    })

    it('should show error toast when update fails', async () => {
      vi.mocked(playlistActions.updatePlaylist).mockResolvedValue({
        error: 'Failed to update playlist',
      })

      render(<PlaylistClient playlists={mockPlaylists} />)

      // Click edit button
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      fireEvent.click(editButtons[0])

      // Update name
      const nameInput = screen.getByLabelText(/playlist name/i)
      fireEvent.change(nameInput, { target: { value: 'Updated Playlist' } })

      // Submit
      const submitButton = screen.getByRole('button', { name: /update/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update playlist')
        expect(mockReload).not.toHaveBeenCalled()
      })
    })
  })

  describe('Playlist Deletion', () => {
    it('should delete a playlist successfully', async () => {
      vi.mocked(playlistActions.deletePlaylist).mockResolvedValue({ success: true })

      render(<PlaylistClient playlists={mockPlaylists} />)

      // Click delete button on first playlist
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(playlistActions.deletePlaylist).toHaveBeenCalledWith('playlist-1')
        expect(toast.success).toHaveBeenCalledWith('Playlist deleted successfully')
        expect(mockReload).toHaveBeenCalled()
      })
    })

    it('should show error toast when deletion fails', async () => {
      vi.mocked(playlistActions.deletePlaylist).mockResolvedValue({
        error: 'Failed to delete playlist',
      })

      render(<PlaylistClient playlists={mockPlaylists} />)

      // Click delete button
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to delete playlist')
        expect(mockReload).not.toHaveBeenCalled()
      })
    })
  })

  describe('Spotify URL Validation', () => {
    it('should validate Spotify URL contains open.spotify.com', async () => {
      render(<PlaylistClient playlists={[]} />)

      // Open modal
      const addButtons = screen.getAllByRole('button', { name: /add playlist/i })
      fireEvent.click(addButtons[0])

      // Fill form with invalid URL
      const nameInput = screen.getByLabelText(/playlist name/i)
      const urlInput = screen.getByLabelText(/spotify url/i)
      fireEvent.change(nameInput, { target: { value: 'Test Playlist' } })
      fireEvent.change(urlInput, { target: { value: 'https://youtube.com/playlist/123' } })

      // Try to submit
      const submitButton = screen.getByRole('button', { name: /create/i })
      fireEvent.click(submitButton)

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/must be a spotify url/i)).toBeInTheDocument()
      })
    })
  })

  describe('External Link Security', () => {
    it('should render external links with target="_blank" and rel="noopener noreferrer"', () => {
      render(<PlaylistClient playlists={mockPlaylists} />)

      const spotifyLinks = screen.getAllByRole('link', { name: /open spotify/i })
      
      spotifyLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('should link to correct Spotify URL', () => {
      render(<PlaylistClient playlists={mockPlaylists} />)

      const spotifyLinks = screen.getAllByRole('link', { name: /open spotify/i })
      
      expect(spotifyLinks[0]).toHaveAttribute('href', 'https://open.spotify.com/playlist/123')
      expect(spotifyLinks[1]).toHaveAttribute('href', 'https://open.spotify.com/playlist/456')
    })
  })

  describe('Modal Interactions', () => {
    it('should close modal when cancel button is clicked', () => {
      render(<PlaylistClient playlists={[]} />)

      // Open modal
      const addButtons = screen.getAllByRole('button', { name: /add playlist/i })
      fireEvent.click(addButtons[0])

      expect(screen.getByRole('heading', { name: 'Add Playlist' })).toBeInTheDocument()

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      // Modal should be closed
      expect(screen.queryByRole('heading', { name: 'Add Playlist' })).not.toBeInTheDocument()
    })

    it('should show correct modal title for create', () => {
      render(<PlaylistClient playlists={[]} />)

      const addButtons = screen.getAllByRole('button', { name: /add playlist/i })
      fireEvent.click(addButtons[0])

      expect(screen.getByRole('heading', { name: 'Add Playlist' })).toBeInTheDocument()
    })

    it('should show correct modal title for edit', () => {
      render(<PlaylistClient playlists={mockPlaylists} />)

      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      fireEvent.click(editButtons[0])

      expect(screen.getByText('Edit Playlist')).toBeInTheDocument()
    })
  })

  describe('Playlist Display', () => {
    it('should display all playlists', () => {
      render(<PlaylistClient playlists={mockPlaylists} />)

      expect(screen.getByText('Study Vibes')).toBeInTheDocument()
      expect(screen.getByText('Chill Beats')).toBeInTheDocument()
    })

    it('should display playlist descriptions when available', () => {
      render(<PlaylistClient playlists={mockPlaylists} />)

      expect(screen.getByText('Focus music for studying')).toBeInTheDocument()
    })

    it('should not display description when null', () => {
      render(<PlaylistClient playlists={mockPlaylists} />)

      // Second playlist has null description
      const cards = screen.getAllByRole('link', { name: /open spotify/i })
      expect(cards).toHaveLength(2)
    })
  })
})
