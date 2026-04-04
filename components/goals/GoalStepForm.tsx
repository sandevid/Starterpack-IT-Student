'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { goalStepSchema, type GoalStepInput } from '@/lib/validations/goal'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface GoalStepFormProps {
  goalId: string
  onSubmit: (data: GoalStepInput) => Promise<void>
  onCancel: () => void
}

export function GoalStepForm({ goalId, onSubmit, onCancel }: GoalStepFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalStepInput>({
    resolver: zodResolver(goalStepSchema),
    defaultValues: {
      title: '',
      goal_id: goalId,
    },
  })

  const handleFormSubmit = async (data: GoalStepInput) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex items-start gap-2 mt-3">
      <div className="flex-1">
        <input
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 text-sm border border-slate-gray/30 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-space-cadet"
          placeholder="Add a step..."
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-caput text-xs mt-1">{errors.title.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="p-2 bg-space-cadet text-cream rounded-[8px] hover:bg-space-cadet/90 transition-colors disabled:opacity-50"
        aria-label="Add step"
      >
        <Plus size={16} />
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="p-2 bg-slate-gray text-cream rounded-[8px] hover:bg-slate-gray/90 transition-colors disabled:opacity-50"
        aria-label="Cancel"
      >
        <X size={16} />
      </button>
    </form>
  )
}
