import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createEssential, updateEssential, deleteEssential } from './essentials'
import { createClient } from '@/lib/supabase/server'

vi.mock('@/lib/supabase/server')
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Essentials Actions', () => {
  const mockUser = { id: 'user-123' }
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null })
  })

  describe('createEssential', () => {
    it('should create an essential successfully', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const essentialData = {
        name: 'MacBook Pro',
        description: 'Laptop for coding',
        icon: 'Laptop' as const,
        category: 'gadget' as const,
      }

      const result = await createEssential(essentialData)

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('essentials')
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        ...essentialData,
        image_url: null,
      })
    })

    it('should create an essential with image_url', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const essentialData = {
        name: 'MacBook Pro',
        description: 'Laptop for coding',
        icon: 'Laptop' as const,
        category: 'gadget' as const,
        image_url: 'https://example.com/image.jpg',
      }

      const result = await createEssential(essentialData)

      expect(result).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        ...essentialData,
      })
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })

      const result = await createEssential({
        name: 'Test',
        icon: 'Laptop',
        category: 'gadget',
      })

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should validate required fields', async () => {
      const result = await createEssential({
        name: '',
        icon: 'Laptop',
        category: 'gadget',
      })

      expect(result.error).toBe('Invalid fields')
      expect(result.details).toBeDefined()
    })

    it('should validate icon is one of valid options', async () => {
      const result = await createEssential({
        name: 'Test',
        icon: 'InvalidIcon' as any,
        category: 'gadget',
      })

      expect(result.error).toBe('Invalid fields')
    })

    it('should validate category is one of valid options', async () => {
      const result = await createEssential({
        name: 'Test',
        icon: 'Laptop',
        category: 'invalid' as any,
      })

      expect(result.error).toBe('Invalid fields')
    })

    it('should handle database errors', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: { message: 'DB error' } })
      mockSupabase.from.mockReturnValue({ insert: mockInsert })

      const result = await createEssential({
        name: 'Test',
        icon: 'Laptop',
        category: 'gadget',
      })

      expect(result).toEqual({ error: 'Failed to create essential' })
    })
  })

  describe('updateEssential', () => {
    it('should update an essential successfully', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ eq: mockEq }) })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      const essentialData = {
        name: 'Updated MacBook',
        description: 'Updated description',
        icon: 'Laptop' as const,
        category: 'gadget' as const,
      }

      const result = await updateEssential('essential-123', essentialData)

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('essentials')
      expect(mockUpdate).toHaveBeenCalledWith({
        ...essentialData,
        image_url: null,
      })
    })

    it('should update an essential with image_url', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ eq: mockEq }) })
      mockSupabase.from.mockReturnValue({ update: mockUpdate })

      const essentialData = {
        name: 'Updated MacBook',
        description: 'Updated description',
        icon: 'Laptop' as const,
        category: 'gadget' as const,
        image_url: 'https://example.com/new-image.jpg',
      }

      const result = await updateEssential('essential-123', essentialData)

      expect(result).toEqual({ success: true })
      expect(mockUpdate).toHaveBeenCalledWith(essentialData)
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })

      const result = await updateEssential('essential-123', {
        name: 'Test',
        icon: 'Laptop',
        category: 'gadget',
      })

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should validate fields on update', async () => {
      const result = await updateEssential('essential-123', {
        name: '',
        icon: 'Laptop',
        category: 'gadget',
      })

      expect(result.error).toBe('Invalid fields')
    })
  })

  describe('deleteEssential', () => {
    it('should delete an essential successfully', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: null })
      const mockDelete = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ eq: mockEq }) })
      mockSupabase.from.mockReturnValue({ delete: mockDelete })

      const result = await deleteEssential('essential-123')

      expect(result).toEqual({ success: true })
      expect(mockSupabase.from).toHaveBeenCalledWith('essentials')
    })

    it('should return error when user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })

      const result = await deleteEssential('essential-123')

      expect(result).toEqual({ error: 'Unauthorized' })
    })

    it('should handle database errors', async () => {
      const mockEq = vi.fn().mockResolvedValue({ error: { message: 'DB error' } })
      const mockDelete = vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ eq: mockEq }) })
      mockSupabase.from.mockReturnValue({ delete: mockDelete })

      const result = await deleteEssential('essential-123')

      expect(result).toEqual({ error: 'Failed to delete essential' })
    })
  })
})
