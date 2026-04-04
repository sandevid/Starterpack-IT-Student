import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginButton } from './LoginButton'
import { createClient } from '@/lib/supabase/client'

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}))

// Mock the Button component
vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, loading, className }: any) => (
    <button onClick={onClick} disabled={loading} className={className} data-loading={loading}>
      {children}
    </button>
  ),
}))

describe('14.1 Test Google OAuth login', () => {
  const mockSignInWithOAuth = vi.fn()
  const mockSupabaseClient = {
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createClient).mockReturnValue(mockSupabaseClient as any)
    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true,
    })
  })

  it('should render the login button', () => {
    render(<LoginButton />)
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()
  })

  it('should call signInWithOAuth when button is clicked', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null })
    const user = userEvent.setup()

    render(<LoginButton />)
    const button = screen.getByRole('button', { name: /sign in with google/i })

    await user.click(button)

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      })
    })
  })

  it('should set loading state when login is initiated', async () => {
    mockSignInWithOAuth.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
    )
    const user = userEvent.setup()

    render(<LoginButton />)
    const button = screen.getByRole('button', { name: /sign in with google/i })

    await user.click(button)

    // Button should be in loading state
    expect(button).toHaveAttribute('data-loading', 'true')
  })

  it('should handle OAuth errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const mockError = { message: 'OAuth failed' }
    mockSignInWithOAuth.mockResolvedValue({ error: mockError })
    const user = userEvent.setup()

    render(<LoginButton />)
    const button = screen.getByRole('button', { name: /sign in with google/i })

    await user.click(button)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Login error:', mockError)
      // Button should not be loading after error
      expect(button).toHaveAttribute('data-loading', 'false')
    })

    consoleErrorSpy.mockRestore()
  })

  it('should use correct redirect URL from window origin', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null })
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' },
      writable: true,
    })
    const user = userEvent.setup()

    render(<LoginButton />)
    const button = screen.getByRole('button', { name: /sign in with google/i })

    await user.click(button)

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'https://example.com/auth/callback',
        },
      })
    })
  })
})
