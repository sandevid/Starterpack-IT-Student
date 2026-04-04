import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-[14px] p-4 shadow-sm ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
