import { createClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client for testing
 * Uses environment variables for test database connection
 */
export function createTestClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key'

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Create a test user session for authenticated tests
 */
export async function createTestSession(email: string = 'test@example.com') {
  const client = createTestClient()
  
  // In a real test environment, you would sign in with a test user
  // For now, this is a placeholder that returns a mock session
  return {
    client,
    userId: 'test-user-id',
    email,
  }
}

/**
 * Clean up test data after tests
 */
export async function cleanupTestData(userId: string) {
  const client = createTestClient()
  
  // Delete test data in reverse order of dependencies
  await client.from('goal_steps').delete().eq('goal_id', userId)
  await client.from('goals').delete().eq('user_id', userId)
  await client.from('todos').delete().eq('user_id', userId)
  await client.from('calendar_events').delete().eq('user_id', userId)
  await client.from('playlists').delete().eq('user_id', userId)
  await client.from('essentials').delete().eq('user_id', userId)
  await client.from('profiles').delete().eq('id', userId)
}
