'use client'

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
import type { EssentialIcon } from '@/types/database.types'

interface IconSelectorProps {
  value: EssentialIcon
  onChange: (icon: EssentialIcon) => void
}

// All 10 icon options
const iconOptions: Array<{
  name: EssentialIcon
  component: React.ComponentType<{ size?: number; className?: string }>
}> = [
  { name: 'Laptop', component: Laptop },
  { name: 'Headphones', component: Headphones },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Pen', component: Pen },
  { name: 'Backpack', component: Backpack },
  { name: 'Watch', component: Watch },
  { name: 'Glasses', component: Glasses },
  { name: 'Coffee', component: Coffee },
  { name: 'Package', component: Package },
  { name: 'Star', component: Star },
]

export function IconSelector({ value, onChange }: IconSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-space-cadet">
        Icon
      </label>
      <div className="grid grid-cols-5 gap-2">
        {iconOptions.map(({ name, component: IconComponent }) => {
          const isSelected = value === name

          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              className={`
                flex items-center justify-center
                w-full aspect-square
                rounded-[10px]
                border-2
                transition-all
                ${
                  isSelected
                    ? 'border-space-cadet bg-space-cadet/10'
                    : 'border-slate-gray/20 bg-white hover:border-slate-gray/40'
                }
              `}
              aria-label={name}
            >
              <IconComponent
                size={20}
                className={isSelected ? 'text-space-cadet' : 'text-slate-gray'}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
