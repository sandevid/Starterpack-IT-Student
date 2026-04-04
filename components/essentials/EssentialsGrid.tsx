'use client'

import type { Essential } from '@/types/database.types'
import { EssentialCard } from './EssentialCard'

interface EssentialsGridProps {
  essentials: Essential[]
  onEdit?: (essential: Essential) => void
  onDelete?: (id: string) => Promise<void>
}

export function EssentialsGrid({ essentials, onEdit, onDelete }: EssentialsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {essentials.map((essential) => (
        <EssentialCard
          key={essential.id}
          essential={essential}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
