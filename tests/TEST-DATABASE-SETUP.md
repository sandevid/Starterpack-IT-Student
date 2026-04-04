# Test Database Setup Guide

This guide explains how to set up a test database for running integration tests with Supabase.

## Overview

The test infrastructure uses Vitest with property-based testing support via fast-check. For integration tests that require a real database, you have two options:

1. **Local Supabase Instance** (Recommended for development)
2. **Separate Test Project** (Recommended for CI/CD)

## Option 1: Local Supabase Instance

### Prerequisites

- Docker Desktop installed and running
- Supabase CLI installed: `npm install -g supabase`

### Setup Steps

1. **Initialize Supabase locally**:
   ```bash
   supabase init
   ```

2. **Start local Supabase**:
   ```bash
   supabase start
   ```

   This will output connection details including:
   - API URL (typically `http://localhost:54321`)
   - Anon key
   - Service role key

3. **Apply database schema**:
   ```bash
   supabase db push
   ```

   Or manually run the schema:
   ```bash
   psql -h localhost -p 54322 -U postgres -d postgres -f supabase-schema.sql
   ```

4. **Create test environment file**:
   ```bash
   cp .env.local .env.test.local
   ```

   Update `.env.test.local` with local Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
   ```

5. **Run tests**:
   ```bash
   npm test
   ```

### Cleanup

To stop the local Supabase instance:
```bash
supabase stop
```

To reset the database:
```bash
supabase db reset
```

## Option 2: Separate Test Project

### Setup Steps

1. **Create a new Supabase project** in the Supabase dashboard specifically for testing

2. **Apply the database schema** to the test project:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste contents of `supabase-schema.sql`
   - Execute the SQL

3. **Configure test environment**:
   Create `.env.test.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-test-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-anon-key
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

## Test Database Utilities

The project includes helper utilities for working with the test database:

### `lib/supabase/test-client.ts`

- `createTestClient()`: Creates a Supabase client for testing
- `createTestSession()`: Creates a test user session
- `cleanupTestData()`: Cleans up test data after tests

### `tests/helpers/test-data.ts`

Factory functions for creating test data:
- `createTestProfile()`
- `createTestCalendarEvent()`
- `createTestTodo()`
- `createTestGoal()`
- `createTestGoalStep()`
- `createTestPlaylist()`
- `createTestEssential()`

### `tests/helpers/property-generators.ts`

Property-based testing generators using fast-check:
- `eventColorArbitrary`
- `calendarEventArbitrary`
- `todoTagArbitrary`
- `todoArbitrary`
- `goalArbitrary`
- `playlistArbitrary`
- `essentialArbitrary`

## Running Tests

### Unit Tests Only

Most tests are unit tests that don't require a database:
```bash
npm test
```

### Integration Tests

Tests that require a database connection should be marked with a specific pattern:
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestClient, cleanupTestData } from '@/lib/supabase/test-client'

describe('Calendar Integration Tests', () => {
  let testUserId: string

  beforeAll(async () => {
    // Setup test user
    testUserId = 'test-user-id'
  })

  afterAll(async () => {
    // Cleanup
    await cleanupTestData(testUserId)
  })

  it('should create a calendar event', async () => {
    const client = createTestClient()
    // Test implementation
  })
})
```

### Property-Based Tests

Example using fast-check:
```typescript
import { describe, it, expect } from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { calendarEventArbitrary } from '@/tests/helpers/property-generators'

describe('Calendar Event Properties', () => {
  test.prop([calendarEventArbitrary])('should validate calendar events', (event) => {
    // Property test implementation
    expect(event.title.length).toBeGreaterThan(0)
    expect(event.title.length).toBeLessThanOrEqual(100)
  })
})
```

## CI/CD Configuration

For GitHub Actions or other CI/CD pipelines:

1. Set up Supabase test project secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Add test step to workflow:
   ```yaml
   - name: Run tests
     env:
       NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
       NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}
     run: npm test
   ```

## Troubleshooting

### Connection Issues

If tests fail to connect to the database:
1. Verify environment variables are set correctly
2. Check that Supabase instance is running (for local setup)
3. Verify network connectivity (for remote test project)

### RLS Policy Issues

If tests fail due to RLS policies:
1. Ensure test user has proper authentication
2. Consider using service role key for integration tests (not recommended for production)
3. Verify RLS policies are correctly configured

### Data Cleanup

If tests leave behind data:
1. Use `cleanupTestData()` in `afterAll` hooks
2. Consider using transactions that can be rolled back
3. Reset the database between test runs if needed

## Best Practices

1. **Isolate test data**: Use unique identifiers for test data
2. **Clean up after tests**: Always clean up test data in `afterAll` hooks
3. **Use factories**: Use test data factories for consistent test data
4. **Mock when possible**: Prefer mocking over real database calls for unit tests
5. **Property-based testing**: Use fast-check for testing invariants and edge cases
