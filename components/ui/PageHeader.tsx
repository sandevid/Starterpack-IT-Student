interface PageHeaderProps {
  title: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-playfair text-space-cadet">{title}</h1>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-space-cadet text-cream rounded-[10px] text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
