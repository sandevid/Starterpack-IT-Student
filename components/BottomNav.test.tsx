import { render, screen } from '@testing-library/react'
import { BottomNav } from './BottomNav'
import { usePathname } from 'next/navigation'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))

const mockUsePathname = usePathname as ReturnType<typeof vi.fn>

describe('BottomNav', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render all navigation items', () => {
    render(<BottomNav />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Calendar')).toBeInTheDocument()
    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText('Goals')).toBeInTheDocument()
    expect(screen.getByText('Playlists')).toBeInTheDocument()
    expect(screen.getByText('Essentials')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('should render all navigation links with correct hrefs', () => {
    render(<BottomNav />)

    expect(screen.getByRole('link', { name: /Home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /Calendar/i })).toHaveAttribute('href', '/calendar')
    expect(screen.getByRole('link', { name: /Tasks/i })).toHaveAttribute('href', '/tasks')
    expect(screen.getByRole('link', { name: /Goals/i })).toHaveAttribute('href', '/goals')
    expect(screen.getByRole('link', { name: /Playlists/i })).toHaveAttribute('href', '/more/playlists')
    expect(screen.getByRole('link', { name: /Essentials/i })).toHaveAttribute('href', '/more/essentials')
    expect(screen.getByRole('link', { name: /Profile/i })).toHaveAttribute('href', '/profile')
  })

  it('should highlight active tab for home route', () => {
    mockUsePathname.mockReturnValue('/')
    render(<BottomNav />)

    const homeLink = screen.getByRole('link', { name: /Home/i })
    expect(homeLink).toHaveClass('text-space-cadet')
  })

  it('should highlight active tab for calendar route', () => {
    mockUsePathname.mockReturnValue('/calendar')
    render(<BottomNav />)

    const calendarLink = screen.getByRole('link', { name: /Calendar/i })
    expect(calendarLink).toHaveClass('text-space-cadet')
  })

  it('should highlight active tab for tasks route', () => {
    mockUsePathname.mockReturnValue('/tasks')
    render(<BottomNav />)

    const tasksLink = screen.getByRole('link', { name: /Tasks/i })
    expect(tasksLink).toHaveClass('text-space-cadet')
  })

  it('should highlight active tab for goals route', () => {
    mockUsePathname.mockReturnValue('/goals')
    render(<BottomNav />)

    const goalsLink = screen.getByRole('link', { name: /Goals/i })
    expect(goalsLink).toHaveClass('text-space-cadet')
  })

  it('should highlight active tab for playlists route', () => {
    mockUsePathname.mockReturnValue('/more/playlists')
    render(<BottomNav />)

    const playlistsLink = screen.getByRole('link', { name: /Playlists/i })
    expect(playlistsLink).toHaveClass('text-space-cadet')
  })

  it('should highlight active tab for essentials route', () => {
    mockUsePathname.mockReturnValue('/more/essentials')
    render(<BottomNav />)

    const essentialsLink = screen.getByRole('link', { name: /Essentials/i })
    expect(essentialsLink).toHaveClass('text-space-cadet')
  })

  it('should highlight active tab for profile route', () => {
    mockUsePathname.mockReturnValue('/profile')
    render(<BottomNav />)

    const profileLink = screen.getByRole('link', { name: /Profile/i })
    expect(profileLink).toHaveClass('text-space-cadet')
  })

  it('should apply inactive styles to non-active tabs', () => {
    mockUsePathname.mockReturnValue('/calendar')
    render(<BottomNav />)

    const homeLink = screen.getByRole('link', { name: /Home/i })
    const tasksLink = screen.getByRole('link', { name: /Tasks/i })

    expect(homeLink).toHaveClass('text-slate-gray')
    expect(tasksLink).toHaveClass('text-slate-gray')
  })

  it('should have fixed positioning at bottom', () => {
    const { container } = render(<BottomNav />)

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0')
  })

  it('should have correct z-index for layering', () => {
    const { container } = render(<BottomNav />)

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('z-40')
  })

  it('should have max-width constraint', () => {
    const { container } = render(<BottomNav />)

    const innerDiv = container.querySelector('.max-w-\\[430px\\]')
    expect(innerDiv).toBeInTheDocument()
  })
})
