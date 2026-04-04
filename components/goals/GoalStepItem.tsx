'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { GoalStep } from '@/types/database.types'

interface GoalStepItemProps {
  step: GoalStep
  onToggle: (stepId: string, completed: boolean) => Promise<void>
  onDelete: (stepId: string) => Promise<void>
}

export function GoalStepItem({ step, onToggle, onDelete }: GoalStepItemProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await onToggle(step.id, !step.completed)
    } finally {
      setIsToggling(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this step?')) {
      setIsDeleting(true)
      try {
        await onDelete(step.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Checkbox with optimistic UI update */}
      <input
        type="checkbox"
        checked={step.completed}
        onChange={handleToggle}
        disabled={isToggling || isDeleting}
        className="w-5 h-5 rounded border-slate-gray/30 text-space-cadet focus:ring-space-cadet cursor-pointer disabled:opacity-50"
        aria-label={`Mark step "${step.title}" as ${step.completed ? 'incomplete' : 'complete'}`}
      />

      {/* Step title with strikethrough when completed */}
      <span
        className={`flex-1 text-sm break-words ${
          step.completed ? 'line-through text-slate-gray' : 'text-space-cadet'
        }`}
      >
        {step.title}
      </span>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={isToggling || isDeleting}
        className="text-slate-gray hover:text-caput transition-colors disabled:opacity-50 flex-shrink-0"
        aria-label={`Delete step: ${step.title}`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
