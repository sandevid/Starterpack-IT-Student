import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LoginButton } from './LoginButton'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-[430px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair text-space-cadet mb-2">
            Starterpack IT Student
          </h1>
          <p className="text-slate-gray">
            Manage your academic life with ease
          </p>
        </div>
        <LoginButton />
      </div>
    </div>
  )
}
