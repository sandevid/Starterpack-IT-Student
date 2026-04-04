'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { goalSchema, type GoalInput } from '@/lib/validations/goal'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import type { Goal } from '@/types/database.types'

interface GoalFormProps {
  onSubmit: (data: GoalInput) => Promise<void>
  onCancel: () => void
  initialData?: Goal
}

export function GoalForm({ onSubmit, onCancel, initialData }: GoalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
        }
      : {
          title: '',
        },
  })

  const handleFormSubmit = async (data: GoalInput) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-space-cadet mb-1">
          Goal Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-4 py-2 border border-slate-gray/30 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-space-cadet"
          placeholder="Enter your goal"
        />
        {errors.title && (
          <p className="text-caput text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="flex-1"
        >
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
