import { Loader2 } from 'lucide-react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-[10px] font-medium transition-colors disabled:opacity-50'

  const variantStyles = {
    primary: 'bg-space-cadet text-cream hover:bg-space-cadet/90',
    secondary: 'bg-slate-gray text-cream hover:bg-slate-gray/90',
    danger: 'bg-caput text-cream hover:bg-caput/90',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <Loader2 className="animate-spin mr-2" size={16} />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
