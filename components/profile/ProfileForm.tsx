'use client'

import { useState } from 'react'
import { Camera, X } from 'lucide-react'
import { updateProfile, uploadProfileImage, deleteProfileImage } from '@/actions/profile'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Profile } from '@/types/database.types'

interface ProfileFormProps {
  profile: Profile | null
  onCancel: () => void
}

export function ProfileForm({ profile, onCancel }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '')
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File must be an image')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB')
      return
    }

    setError('')
    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadProfileImage(formData)

    if (result.error) {
      setError(result.error)
    } else if (result.url) {
      setAvatarPreview(result.url)
    }

    setIsUploading(false)
  }

  const handleDeleteImage = async () => {
    setIsUploading(true)
    const result = await deleteProfileImage()

    if (result.error) {
      setError(result.error)
    } else {
      setAvatarPreview('')
    }

    setIsUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)

    const formData = new FormData()
    formData.append('full_name', fullName)

    const result = await updateProfile(formData)

    if (result.error) {
      setError(result.error)
    } else {
      onCancel()
    }

    setIsSaving(false)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="font-medium text-space-cadet">Edit Profile</h3>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-powder-blue flex items-center justify-center">
                <Camera size={32} className="text-slate-gray" />
              </div>
            )}
            {avatarPreview && (
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={isUploading}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
              className="hidden"
            />
            <span className="text-sm text-blue-ribbon hover:underline">
              {isUploading ? 'Uploading...' : 'Change Photo'}
            </span>
          </label>
          <p className="text-xs text-slate-gray text-center">
            Max 2MB. JPG, PNG, or GIF
          </p>
        </div>

        {/* Full Name Input */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-space-cadet mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-powder-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-ribbon"
            placeholder="Enter your full name"
            required
          />
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isSaving || isUploading}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
