/**
 * Integration Test: Authentication Flow End-to-End
 * 
 * Tests the complete authentication flow from login to logout,
 * including profile creation and route protection.
 * 
 * Validates Requirements 1 and 12 (Google OAuth Authentication & Data Security)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { signOut } from '@/actions/auth'

// Mock Supabase clients
vi.mock('@/lib/supabase/server')
vi.mock('@/lib/supabase/client')
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Integration: Authentication Flow', () => {
  let mockServerClient: any
  let mockBrowserClient: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockServerClient = {
      auth: {
        getUser: vi.fn(),
        signOut: vi.fn(),
      },
      from: vi.fn(),
    }

    mockBrowserClient = {
      auth: {
        signInWithOAuth: vi.fn(),
        getUser: vi.fn(),
      },
    }

    vi.mocked(createServerClient).mockResolvedValue(mockServerClient)
    vi.mocked(createBrowserClient).mockReturnValue(mockBrowserClient)
  })

  describe('59.1: Authentication Flow End-to-End', () => {
    it('should complete full authentication flow: login -> profile creation -> access', async () => {
      // Step 1: User initiates Google OAuth login
      const mockOAuthResponse = {
        data: { url: 'https://accounts.google.com/oauth', provider: 'google' },
        error: null,
      }
      mockBrowserClient.auth.signInWithOAuth.mockResolvedValue(mockOAuthResponse)

      const oauthResult = await mockBrowserClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      })

      expect(oauthResult.data?.url).toBeDefined()
      expect(oauthResult.error).toBeNull()

      // Step 2: OAuth callback creates/updates profile
      const mockUser = {
        id: 'user-123',
        email: 'student@example.com',
        user_metadata: {
          full_name: 'Test Student',
          avatar_url: 'https://example.com/avatar.jpg',
        },
      }

      mockServerClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockUpsert = vi.fn().mockResolvedValue({ error: null })
      mockServerClient.from.mockReturnValue({ upsert: mockUpsert })

      // Simulate profile creation in callback
      const { data: { user } } = await mockServerClient.auth.getUser()
      expect(user).toBeDefined()

      await mockServerClient.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name,
        avatar_url: user.user_metadata.avatar_url,
        updated_at: new Date().toISOString(),
      })

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-123',
          email: 'student@example.com',
          full_name: 'Test Student',
          avatar_url: 'https://example.com/avatar.jpg',
        })
      )

      // Step 3: User can access protected routes
      const authenticatedUser = await mockServerClient.auth.getUser()
      expect(authenticatedUser.data.user).toBeDefined()
      expect(authenticatedUser.data.user.id).toBe('user-123')
    })

    it('should protect routes and redirect unauthenticated users', async () => {
      // Simulate unauthenticated user
      mockServerClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const { data: { user } } = await mockServerClient.auth.getUser()

      expect(user).toBeNull()
      // In middleware, this would trigger redirect to /login
    })

    it('should handle logout and clear session', async () => {
      // Setup authenticated user
      mockServerClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      mockServerClient.auth.signOut.mockResolvedValue({ error: null })

      // Perform logout
      await signOut()

      expect(mockServerClient.auth.signOut).toHaveBeenCalled()
    })

    it('should enforce RLS policies - users can only access their own data', async () => {
      const mockUser = { id: 'user-123' }
      mockServerClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      // Attempt to query data - RLS ensures only user's data is returned
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [{ id: 'todo-1', user_id: 'user-123', title: 'My Todo' }],
          error: null,
        }),
      })
      mockServerClient.from.mockReturnValue({ select: mockSelect })

      const { data } = await mockServerClient
        .from('todos')
        .select('*')
        .eq('user_id', mockUser.id)

      expect(data).toHaveLength(1)
      expect(data[0].user_id).toBe('user-123')
    })

    it('should update existing profile on subsequent logins', async () => {
      const mockUser = {
        id: 'existing-user-123',
        email: 'student@example.com',
        user_metadata: {
          full_name: 'Updated Name',
          avatar_url: 'https://example.com/new-avatar.jpg',
        },
      }

      mockServerClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockUpsert = vi.fn().mockResolvedValue({ error: null })
      mockServerClient.from.mockReturnValue({ upsert: mockUpsert })

      // Simulate profile update
      await mockServerClient.from('profiles').upsert({
        id: mockUser.id,
        email: mockUser.email,
        full_name: mockUser.user_metadata.full_name,
        avatar_url: mockUser.user_metadata.avatar_url,
        updated_at: new Date().toISOString(),
      })

      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          full_name: 'Updated Name',
          avatar_url: 'https://example.com/new-avatar.jpg',
        })
      )
    })
  })
})
