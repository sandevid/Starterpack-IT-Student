import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPlaylist, updatePlaylist, deletePlaylist } from './playlists'
import { createClient } from '@/lib/supabase/server'

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock Next.js cache revalidation
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Playlist Actions', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(),
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase)
  })

  describe('createPlaylist', () => {
    it('should create a playlist with valid data', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const result = await createPlaylist({
        name: 'Study Vibes',
        description: 'Focus music',
        url: 'https://open.spotify.com/playlist/123',
      })

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('playlists')
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        name: 'Study Vibes',
        description: 'Focus music',
        url: 'https://open.spotify.com/playlist/123',
      })
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      const result = await createPlaylist({
        name: 'Study Vibes',
        url: 'https://open.spotify.com/playlist/123',
      })

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should validate required name field', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const result = await createPlaylist({
        name: '',
        url: 'https://open.spotify.com/playlist/123',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should validate Spotify URL format', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const result = await createPlaylist({
        name: 'Study Vibes',
        url: 'https://youtube.com/playlist/123',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should validate URL is a valid URL', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const result = await createPlaylist({
        name: 'Study Vibes',
        url: 'not-a-url',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should return error when database insert fails', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockInsert = vi.fn().mockResolvedValue({ error: { message: 'DB error' } })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const result = await createPlaylist({
        name: 'Study Vibes',
        url: 'https://open.spotify.com/playlist/123',
      })

      expect(result).toEqual({ error: 'Failed to create playlist' })
    })
  })

  describe('updatePlaylist', () => {
    it('should update a playlist with valid data', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      const result = await updatePlaylist('playlist-456', {
        name: 'Updated Playlist',
        url: 'https://open.spotify.com/playlist/456',
      })

      expect(result).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith({
        name: 'Updated Playlist',
        url: 'https://open.spotify.com/playlist/456',
      })
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      const result = await updatePlaylist('playlist-456', {
        name: 'Updated Playlist',
        url: 'https://open.spotify.com/playlist/456',
      })

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should validate name field', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const result = await updatePlaylist('playlist-456', {
        name: '',
        url: 'https://open.spotify.com/playlist/456',
      })

      expect(result.error).toBe('Invalid fields')
    })

    it('should validate Spotify URL format', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const result = await updatePlaylist('playlist-456', {
        name: 'Updated Playlist',
        url: 'https://youtube.com/playlist/456',
      })

      expect(result.error).toBe('Invalid fields')
    })

    it('should return error when database update fails', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockEq2 = vi.fn().mockResolvedValue({ error: { message: 'DB error' } })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      const result = await updatePlaylist('playlist-456', {
        name: 'Updated Playlist',
        url: 'https://open.spotify.com/playlist/456',
      })

      expect(result).toEqual({ error: 'Failed to update playlist' })
    })
  })

  describe('deletePlaylist', () => {
    it('should delete a playlist', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ delete: mockDelete })

      const result = await deletePlaylist('playlist-456')

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('playlists')
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      const result = await deletePlaylist('playlist-456')

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should return error when database delete fails', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })

      const mockEq2 = vi.fn().mockResolvedValue({ error: { message: 'DB error' } })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 })
      mockSupabase.from.mockReturnValue({ delete: mockDelete })

      const result = await deletePlaylist('playlist-456')

      expect(result).toEqual({ error: 'Failed to delete playlist' })
    })
  })
})
