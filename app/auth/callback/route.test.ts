import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url) => ({ url, redirected: true })),
  },
}))

describe('14.2 Test profile creation on first login', () => {
  const mockExchangeCodeForSession = vi.fn()
  const mockUpsert = vi.fn()
  const mockFrom = vi.fn()
  const mockSupabaseClient = {
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
    from: mockFrom,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createClient).mockResolvedValue(mockSupabaseClient as any)
    mockFrom.mockReturnValue({
      upsert: mockUpsert,
    })
  })

  it('should create profile with Google OAuth data on first login', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
      },
    }

    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockUpsert.mockResolvedValue({ error: null })

    const request = new Request('http://localhost:3000/auth/callback?code=test-code')
    await GET(request)

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('test-code')
    expect(mockFrom).toHaveBeenCalledWith('profiles')
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user-123',
        email: 'test@example.com',
        full_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
      })
    )
  })

  it('should update existing profile on subsequent login', async () => {
    const mockUser = {
      id: 'existing-user-456',
      email: 'existing@example.com',
      user_metadata: {
        full_name: 'Updated Name',
        avatar_url: 'https://example.com/new-avatar.jpg',
      },
    }

    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockUpsert.mockResolvedValue({ error: null })

    const request = new Request('http://localhost:3000/auth/callback?code=test-code')
    await GET(request)

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'existing-user-456',
        email: 'existing@example.com',
        full_name: 'Updated Name',
        avatar_url: 'https://example.com/new-avatar.jpg',
      })
    )
  })

  it('should include updated_at timestamp in profile data', async () => {
    const mockUser = {
      id: 'user-789',
      email: 'timestamp@example.com',
      user_metadata: {
        full_name: 'Timestamp User',
        avatar_url: 'https://example.com/avatar.jpg',
      },
    }

    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockUpsert.mockResolvedValue({ error: null })

    const request = new Request('http://localhost:3000/auth/callback?code=test-code')
    await GET(request)

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        updated_at: expect.any(String),
      })
    )

    // Verify it's a valid ISO date string
    const callArgs = mockUpsert.mock.calls[0][0]
    expect(() => new Date(callArgs.updated_at)).not.toThrow()
  })

  it('should redirect to home page after successful authentication', async () => {
    const mockUser = {
      id: 'user-redirect',
      email: 'redirect@example.com',
      user_metadata: {
        full_name: 'Redirect User',
        avatar_url: 'https://example.com/avatar.jpg',
      },
    }

    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockUpsert.mockResolvedValue({ error: null })

    const request = new Request('http://localhost:3000/auth/callback?code=test-code')
    const response = await GET(request)

    expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/')
  })

  it('should handle profile creation errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockUser = {
      id: 'user-error',
      email: 'error@example.com',
      user_metadata: {
        full_name: 'Error User',
        avatar_url: 'https://example.com/avatar.jpg',
      },
    }

    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    mockUpsert.mockResolvedValue({ error: { message: 'Database error' } })

    const request = new Request('http://localhost:3000/auth/callback?code=test-code')
    await GET(request)

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Profile creation error:',
      expect.objectContaining({ message: 'Database error' })
    )

    consoleErrorSpy.mockRestore()
  })

  it('should redirect to home even without code parameter', async () => {
    const request = new Request('http://localhost:3000/auth/callback')
    const response = await GET(request)

    expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/')
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled()
  })

  it('should handle session exchange errors', async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid code' },
    })

    const request = new Request('http://localhost:3000/auth/callback?code=invalid-code')
    const response = await GET(request)

    expect(mockUpsert).not.toHaveBeenCalled()
    expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000/')
  })
})
