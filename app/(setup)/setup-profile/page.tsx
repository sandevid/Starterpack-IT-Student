import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SetupProfileForm } from '@/components/profile/SetupProfileForm'

export default async function SetupProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if profile is already complete
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // If profile has full_name, redirect to home
  if (profile?.full_name) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <SetupProfileForm email={user.email!} />
      </div>
    </div>
  )
}
