'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, X } from 'lucide-react'
import { setupProfile, uploadProfileImage } from '@/actions/profile'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface SetupProfileFormProps {
  email: string
}

export function SetupProfileForm({ email }: SetupProfileFormProps) {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
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

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Supabase
    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadProfileImage(formData)

    if (result.error) {
      setError(result.error)
      setAvatarPreview('')
    } else if (result.url) {
      setAvatarUrl(result.url)
    }

    setIsUploading(false)
  }

  const handleDeleteImage = () => {
    setAvatarPreview('')
    setAvatarUrl('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }

    setError('')
    setIsSaving(true)

    const formData = new FormData()
    formData.append('full_name', fullName)

    const result = await setupProfile(formData)

    if (result.error) {
      setError(result.error)
      setIsSaving(false)
    } else {
      // Redirect to home
      router.push('/')
      router.refresh()
    }
  }

  const handleSkip = async () => {
    setIsSaving(true)
    
    const formData = new FormData()
    formData.append('full_name', 'User')

    await setupProfile(formData)
    router.push('/')
    router.refresh()
  }

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-playfair text-space-cadet mb-2">
          Welcome! 👋
        </h1>
        <p className="text-sm text-slate-gray">
          Let&apos;s set up your profile to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile preview"
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
              disabled={isUploading || isSaving}
              className="hidden"
            />
            <span className="text-sm text-blue-ribbon hover:underline">
              {isUploading ? 'Uploading...' : avatarPreview ? 'Change Photo' : 'Add Photo (Optional)'}
            </span>
          </label>
          <p className="text-xs text-slate-gray text-center">
            Max 2MB. JPG, PNG, or GIF
          </p>
        </div>

        {/* Email Display */}
        <div>
          <label className="block text-sm font-medium text-space-cadet mb-2">
            Email
          </label>
          <div className="w-full px-4 py-2 bg-powder-blue/30 border border-powder-blue rounded-lg text-slate-gray">
            {email}
          </div>
        </div>

        {/* Full Name Input */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-space-cadet mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-powder-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-ribbon"
            placeholder="Enter your full name"
            required
            disabled={isSaving}
          />
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSaving || isUploading || !fullName.trim()}
          >
            {isSaving ? 'Setting up...' : 'Continue'}
          </Button>
          
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSaving}
            className="w-full text-sm text-slate-gray hover:text-space-cadet transition-colors"
          >
            Skip for now
          </button>
        </div>
      </form>
    </Card>
  )
}
