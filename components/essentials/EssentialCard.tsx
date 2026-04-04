'use client'

import Image from 'next/image'
import {
  Laptop,
  Headphones,
  BookOpen,
  Pen,
  Backpack,
  Watch,
  Glasses,
  Coffee,
  Package,
  Star,
} from 'lucide-react'
import type { Essential, EssentialIcon } from '@/types/database.types'
import { Card } from '@/components/ui/Card'

interface EssentialCardProps {
  essential: Essential
  onEdit?: (essential: Essential) => void
  onDelete?: (id: string) => Promise<void>
}

// Icon mapping for dynamic rendering
const iconMap: Record<EssentialIcon, React.ComponentType<{ size?: number; className?: string }>> = {
  Laptop,
  Headphones,
  BookOpen,
  Pen,
  Backpack,
  Watch,
  Glasses,
  Coffee,
  Package,
  Star,
}

// Category color mapping
const categoryColors: Record<string, string> = {
  gadget: 'bg-space-cadet text-cream',
  stationery: 'bg-tan text-coffee',
  fashion: 'bg-caput text-cream',
  book: 'bg-slate-gray text-cream',
  general: 'bg-coffee text-cream',
}

export function EssentialCard({ essential, onEdit, onDelete }: EssentialCardProps) {
  const IconComponent = iconMap[essential.icon]

  return (
    <Card>
      <div className="flex flex-col gap-3">
        {/* Image or Icon */}
        {essential.image_url ? (
          <div className="relative w-full h-32 bg-slate-gray/10 rounded-[10px] overflow-hidden">
            <Image
              src={essential.image_url}
              alt={essential.name}
              fill
              className="object-cover"
            />
            <span
              className={`absolute top-2 right-2 px-2 py-1 rounded-[6px] text-xs font-medium ${
                categoryColors[essential.category] || categoryColors.general
              }`}
            >
              {essential.category}
            </span>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div className="flex-shrink-0 w-12 h-12 bg-space-cadet/10 rounded-[10px] flex items-center justify-center">
              <IconComponent size={24} className="text-space-cadet" />
            </div>
            <span
              className={`px-2 py-1 rounded-[6px] text-xs font-medium ${
                categoryColors[essential.category] || categoryColors.general
              }`}
            >
              {essential.category}
            </span>
          </div>
        )}

        {/* Name */}
        <h3 className="text-base font-semibold text-space-cadet">
          {essential.name}
        </h3>

        {/* Description */}
        {essential.description && (
          <p className="text-sm text-slate-gray line-clamp-2">
            {essential.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onEdit?.(essential)}
            className="flex-1 px-3 py-2 bg-slate-gray text-cream rounded-[10px] text-sm font-medium hover:bg-slate-gray/90"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(essential.id)}
            className="flex-1 px-3 py-2 bg-caput text-cream rounded-[10px] text-sm font-medium hover:bg-caput/90"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  )
}
