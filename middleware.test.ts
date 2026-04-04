import { describe, it, expect, vi, beforeEach } from 'vitest'
import { middleware } from './middleware'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Mock Supabase SSR
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))

describe('14.3 Test route protection', () => {
  const mockGetUser = vi.fn()
  const mockGetAll = vi.fn()
  const mockSet = vi.fn()
  const mockSupabaseClient = {
    auth: {
      getUser: mockGetUser,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetAll.mockReturnValue([])
    vi.mocked(createServerClient).mockReturnValue(mockSupabaseClient as any)

    // Mock environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('should redirect unauthenticated users to /login when accessing protected routes', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const request = new NextRequest('http://localhost:3000/')
    const response = await middleware(request)

    expect(response.status).toBe(307) // Redirect status
    expect(response.headers.get('location')).toBe('http://localhost:3000/login')
  })

  it('should allow unauthenticated users to access /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const request = new NextRequest('http://localhost:3000/login')
    const response = await middleware(request)

    expect(response.status).not.toBe(307)
    expect(response.headers.get('location')).not.toBe('http://localhost:3000/login')
  })

  it('should allow unauthenticated users to access /auth/callback', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const request = new NextRequest('http://localhost:3000/auth/callback?code=test')
    const response = await middleware(request)

    expect(response.status).not.toBe(307)
    expect(response.headers.get('location')).not.toBe('http://localhost:3000/login')
  })

  it('should redirect authenticated users from /login to home', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
    })

    const request = new NextRequest('http://localhost:3000/login')
    const response = await middleware(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/')
  })

  it('should allow authenticated users to access protected routes', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
    })

    const request = new NextRequest('http://localhost:3000/')
    const response = await middleware(request)

    expect(response.status).not.toBe(307)
    expect(response.headers.get('location')).toBeNull()
  })

  it('should allow authenticated users to access /calendar', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
    })

    const request = new NextRequest('http://localhost:3000/calendar')
    const response = await middleware(request)

    expect(response.status).not.toBe(307)
    expect(response.headers.get('location')).toBeNull()
  })

  it('should allow authenticated users to access /tasks', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
    })

    const request = new NextRequest('http://localhost:3000/tasks')
    const response = await middleware(request)

    expect(response.status).not.toBe(307)
    expect(response.headers.get('location')).toBeNull()
  })

  it('should allow authenticated users to access /goals', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
    })

    const request = new NextRequest('http://localhost:3000/goals')
    const response = await middleware(request)

    expect(response.status).not.toBe(307)
    expect(response.headers.get('location')).toBeNull()
  })

  it('should allow authenticated users to access /more', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
    })

    const request = new NextRequest('http://localhost:3000/more')
    const response = await middleware(request)

    expect(response.status).not.toBe(307)
    expect(response.headers.get('location')).toBeNull()
  })

  it('should create Supabase client with correct configuration', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const request = new NextRequest('http://localhost:3000/')
    await middleware(request)

    expect(createServerClient).toHaveBeenCalledWith(
      'http://localhost:54321',
      'test-anon-key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      })
    )
  })

  it('should refresh session by calling getUser', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
    })

    const request = new NextRequest('http://localhost:3000/')
    await middleware(request)

    expect(mockGetUser).toHaveBeenCalled()
  })
})
