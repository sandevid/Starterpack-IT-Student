import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signOut } from './auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('14.4 Test logout functionality', () => {
  const mockSignOut = vi.fn()
  const mockSupabaseClient = {
    auth: {
      signOut: mockSignOut,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createClient).mockResolvedValue(mockSupabaseClient as any)
  })

  it('should call Supabase signOut when logout is triggered', async () => {
    mockSignOut.mockResolvedValue({ error: null })

    try {
      await signOut()
    } catch (error) {
      // redirect throws an error in Next.js, which is expected
    }

    expect(mockSignOut).toHaveBeenCalled()
  })

  it('should redirect to /login after successful logout', async () => {
    mockSignOut.mockResolvedValue({ error: null })

    try {
      await signOut()
    } catch (error) {
      // redirect throws an error in Next.js, which is expected
    }

    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('should clear session by calling signOut', async () => {
    mockSignOut.mockResolvedValue({ error: null })

    try {
      await signOut()
    } catch (error) {
      // redirect throws an error in Next.js, which is expected
    }

    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it('should redirect even if signOut encounters an error', async () => {
    mockSignOut.mockResolvedValue({ error: { message: 'Logout error' } })

    try {
      await signOut()
    } catch (error) {
      // redirect throws an error in Next.js, which is expected
    }

    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('should create Supabase server client', async () => {
    mockSignOut.mockResolvedValue({ error: null })

    try {
      await signOut()
    } catch (error) {
      // redirect throws an error in Next.js, which is expected
    }

    expect(createClient).toHaveBeenCalled()
  })
})
