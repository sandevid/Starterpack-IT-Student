import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Essential } from '@/types/database.types'
import { EssentialClient } from '@/components/essentials/EssentialClient'

export default async function EssentialsPage() {
  const supabase = await createClient()
  
  // Fetch user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all essentials for user
  const { data: essentials } = await supabase
    .from('essentials')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allEssentials: Essential[] = essentials || []

  return (
    <div className="min-h-screen bg-cream p-6 pb-24">
      <div className="max-w-[430px] mx-auto">
        <EssentialClient essentials={allEssentials} />
      </div>
    </div>
  )
}
