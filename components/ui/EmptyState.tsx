import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <Icon size={48} className="text-slate-gray mb-4" />
      <h3 className="text-lg font-playfair text-space-cadet mb-2">{title}</h3>
      <p className="text-sm text-slate-gray mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-space-cadet text-cream rounded-[10px] font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
