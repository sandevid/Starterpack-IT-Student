'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { essentialSchema, type EssentialInput } from '@/lib/validations/essential'
import { Button } from '@/components/ui/Button'
import { IconSelector } from './IconSelector'
import { ImageUpload } from './ImageUpload'
import { uploadEssentialImage } from '@/lib/storage/essentials'
import { createClient } from '@/lib/supabase/client'
import type { Essential, EssentialCategory } from '@/types/database.types'

interface EssentialFormProps {
  onSubmit: (data: EssentialInput) => Promise<void>
  onCancel: () => void
  initialData?: Essential
}

const categoryOptions: Array<{ value: EssentialCategory; label: string }> = [
  { value: 'gadget', label: 'Gadget' },
  { value: 'stationery', label: 'Stationery' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'book', label: 'Book' },
  { value: 'general', label: 'General' },
]

export function EssentialForm({ onSubmit, onCancel, initialData }: EssentialFormProps) {
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EssentialInput>({
    resolver: zodResolver(essentialSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || '',
          icon: initialData.icon,
          category: initialData.category,
          image_url: initialData.image_url || '',
        }
      : {
          icon: 'Laptop',
          category: 'general',
          image_url: '',
        },
  })

  const handleImageUpload = async (file: File): Promise<string> => {
    setUploadError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const url = await uploadEssentialImage(file, user.id)
      return url
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed'
      setUploadError(message)
      throw error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-space-cadet mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-3 py-2 border border-slate-gray/30 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-space-cadet"
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="text-caput text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description Textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-space-cadet mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-slate-gray/30 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-space-cadet resize-none"
          placeholder="Describe the product..."
        />
        {errors.description && (
          <p className="text-caput text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <Controller
          name="image_url"
          control={control}
          render={({ field }) => (
            <ImageUpload
              value={field.value || null}
              onChange={(url) => field.onChange(url || '')}
              onUpload={handleImageUpload}
            />
          )}
        />
        {uploadError && (
          <p className="text-caput text-sm mt-1">{uploadError}</p>
        )}
        {errors.image_url && (
          <p className="text-caput text-sm mt-1">{errors.image_url.message}</p>
        )}
      </div>

      {/* Icon Selector */}
      <div>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <IconSelector value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.icon && (
          <p className="text-caput text-sm mt-1">{errors.icon.message}</p>
        )}
      </div>

      {/* Category Selector */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-space-cadet mb-1">
          Category
        </label>
        <select
          id="category"
          {...register('category')}
          className="w-full px-3 py-2 border border-slate-gray/30 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-space-cadet bg-white"
        >
          {categoryOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-caput text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
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
