import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { fc } from '@fast-check/vitest'

// Configure fast-check for property-based testing
fc.configureGlobal({
  numRuns: 100, // Number of test cases to generate per property
  verbose: false, // Set to true for debugging
})

// Mock environment variables
beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
})

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
})
