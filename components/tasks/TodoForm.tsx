'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { todoSchema, type TodoInput } from '@/lib/validations/todo'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import type { Todo } from '@/types/database.types'

interface TodoFormProps {
  onSubmit: (data: TodoInput) => Promise<void>
  onCancel: () => void
  initialData?: Todo
}

const tagOptions = [
  { value: 'math', label: 'Math', color: 'bg-blue-500' },
  { value: 'english', label: 'English', color: 'bg-purple-500' },
  { value: 'science', label: 'Science', color: 'bg-green-500' },
  { value: 'ipa', label: 'IPA', color: 'bg-orange-500' },
  { value: 'ips', label: 'IPS', color: 'bg-pink-500' },
  { value: 'general', label: 'General', color: 'bg-slate-gray' },
] as const

export function TodoForm({ onSubmit, onCancel, initialData }: TodoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TodoInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          tag: initialData.tag,
        }
      : {
          title: '',
          tag: 'general',
        },
  })

  const selectedTag = watch('tag')

  const handleFormSubmit = async (data: TodoInput) => {
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
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-4 py-2 border border-slate-gray/30 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-space-cadet"
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="text-caput text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Tag Selector */}
      <div>
        <label className="block text-sm font-medium text-space-cadet mb-2">
          Subject Tag
        </label>
        <div className="grid grid-cols-2 gap-2">
          {tagOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue('tag', option.value)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-[10px] transition-colors ${
                selectedTag === option.value
                  ? 'border-space-cadet bg-space-cadet/5'
                  : 'border-slate-gray/30 hover:border-slate-gray/50'
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${option.color}`} />
              <span className="text-sm text-space-cadet">{option.label}</span>
            </button>
          ))}
        </div>
        {errors.tag && (
          <p className="text-caput text-sm mt-1">{errors.tag.message}</p>
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
