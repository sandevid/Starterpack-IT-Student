import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (!code) {
    // No code provided, redirect to login
    return NextResponse.redirect(`${origin}/login`)
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    if (data.user) {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', data.user.id)
        .single()

      if (!existingProfile) {
        // Create new profile without full_name (will be set in setup)
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            avatar_url: data.user.user_metadata.avatar_url,
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        // Redirect to setup profile for new users
        return NextResponse.redirect(`${origin}/setup-profile`)
      } else if (!existingProfile.full_name) {
        // Existing profile but no full_name, redirect to setup
        return NextResponse.redirect(`${origin}/setup-profile`)
      }
    }

    // Redirect to home with a clean URL
    return NextResponse.redirect(`${origin}/`)
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(`${origin}/login?error=callback_failed`)
  }
}
