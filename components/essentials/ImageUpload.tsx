'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value: string | null
  onChange: (url: string | null) => void
  onUpload: (file: File) => Promise<string>
}

export function ImageUpload({ value, onChange, onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB')
      return
    }

    try {
      setUploading(true)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file
      const url = await onUpload(file)
      onChange(url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-space-cadet">
        Product Image (Optional)
      </label>

      {preview ? (
        <div className="relative w-full h-48 bg-slate-gray/10 rounded-[10px] overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-caput text-cream rounded-full hover:bg-caput/90 transition-colors"
            disabled={uploading}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-slate-gray/30 rounded-[10px] flex flex-col items-center justify-center cursor-pointer hover:border-slate-gray/50 transition-colors bg-slate-gray/5"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-space-cadet" />
              <p className="text-sm text-slate-gray">Uploading...</p>
            </div>
          ) : (
            <>
              <ImageIcon size={32} className="text-slate-gray mb-2" />
              <p className="text-sm text-slate-gray mb-1">Click to upload image</p>
              <p className="text-xs text-slate-gray/70">PNG, JPG up to 2MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
    </div>
  )
}
