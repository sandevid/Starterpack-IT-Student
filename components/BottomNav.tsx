'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, CheckSquare, Target, Music, Package, User } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/goals', icon: Target, label: 'Goals' },
  { href: '/more/playlists', icon: Music, label: 'Playlists' },
  { href: '/more/essentials', icon: Package, label: 'Essentials' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-gray/20 z-40">
      <div className="max-w-[430px] mx-auto flex justify-around items-center h-14 px-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-space-cadet' : 'text-slate-gray'
              }`}
            >
              <Icon size={18} />
              <span className="text-[9px] mt-0.5 font-jetbrains leading-tight">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
