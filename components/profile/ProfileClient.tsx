'use client'

import { useState } from 'react'
import { User, Mail, Calendar, LogOut, Edit } from 'lucide-react'
import { signOut } from '@/actions/auth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProfileForm } from './ProfileForm'
import type { Profile } from '@/types/database.types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface ProfileClientProps {
  profile: Profile | null
  user: SupabaseUser
}

export function ProfileClient({ profile, user }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-playfair text-space-cadet">Profile</h1>
        <ProfileForm profile={profile} onCancel={() => setIsEditing(false)} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-playfair text-space-cadet">Profile</h1>

      {/* Profile Card */}
      <Card className="flex flex-col items-center py-6">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name || 'User'}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-powder-blue flex items-center justify-center mb-4">
            <User size={32} className="text-slate-gray" />
          </div>
        )}
        <h2 className="text-xl font-playfair text-space-cadet mb-1">
          {profile?.full_name || 'User'}
        </h2>
        <p className="text-sm text-slate-gray">{profile?.email}</p>
        
        <Button
          onClick={() => setIsEditing(true)}
          variant="secondary"
          className="mt-4 flex items-center gap-2"
        >
          <Edit size={16} />
          Edit Profile
        </Button>
      </Card>

      {/* Account Info */}
      <Card className="space-y-4">
        <h3 className="font-medium text-space-cadet mb-3">Account Information</h3>
        
        <div className="flex items-center gap-3 text-sm">
          <User size={18} className="text-slate-gray" />
          <div>
            <p className="text-slate-gray text-xs">Full Name</p>
            <p className="text-space-cadet">{profile?.full_name || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Mail size={18} className="text-slate-gray" />
          <div>
            <p className="text-slate-gray text-xs">Email</p>
            <p className="text-space-cadet">{profile?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Calendar size={18} className="text-slate-gray" />
          <div>
            <p className="text-slate-gray text-xs">Member Since</p>
            <p className="text-space-cadet">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Unknown'}
            </p>
          </div>
        </div>
      </Card>

      {/* Sign Out Button */}
      <Button
        onClick={handleSignOut}
        variant="danger"
        className="w-full flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        Sign Out
      </Button>
    </div>
  )
}
