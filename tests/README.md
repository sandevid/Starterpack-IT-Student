# Testing Documentation

This directory contains comprehensive tests for the Starterpack IT Student application.

## Quick Start

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Test Infrastructure

### Testing Stack

- **Vitest**: Fast unit test framework with native ESM support
- **React Testing Library**: Testing React components with user-centric queries
- **@testing-library/user-event**: Simulating realistic user interactions
- **@testing-library/jest-dom**: Custom matchers for DOM assertions
- **fast-check**: Property-based testing for testing invariants and edge cases
- **@fast-check/vitest**: Vitest integration for fast-check

### Configuration Files

- **vitest.config.ts**: Vitest configuration with React plugin, path aliases, and coverage settings
- **vitest.setup.ts**: Global test setup with environment variables, fast-check configuration, and cleanup hooks

### Test Database Setup

For integration tests that require a database connection, see:
- **[TEST-DATABASE-SETUP.md](./TEST-DATABASE-SETUP.md)**: Complete guide for setting up local or remote test databases

## Test Helpers

### Test Data Factories
**Location:** `tests/helpers/test-data.ts`

Factory functions for creating test data:
- `createTestProfile()` - Create test user profiles
- `createTestCalendarEvent()` - Create test calendar events
- `createTestTodo()` - Create test todos
- `createTestGoal()` - Create test goals
- `createTestGoalStep()` - Create test goal steps
- `createTestPlaylist()` - Create test playlists
- `createTestEssential()` - Create test essentials

### Property-Based Testing Generators
**Location:** `tests/helpers/property-generators.ts`

Fast-check arbitraries for domain types:
- `eventColorArbitrary` - Generate valid event colors
- `calendarEventArbitrary` - Generate valid calendar events
- `todoTagArbitrary` - Generate valid todo tags
- `todoArbitrary` - Generate valid todos
- `goalArbitrary` - Generate valid goals
- `playlistArbitrary` - Generate valid playlists with Spotify URLs
- `essentialArbitrary` - Generate valid essentials

### Database Utilities
**Location:** `lib/supabase/test-client.ts`

Utilities for working with test databases:
- `createTestClient()` - Create Supabase client for testing
- `createTestSession()` - Create test user session
- `cleanupTestData()` - Clean up test data after tests

## Test Coverage

### Task 14: Test Authentication Flow ✅

All subtasks have been completed with comprehensive test coverage:

#### 14.1 Test Google OAuth Login
**File:** `app/(auth)/login/LoginButton.test.tsx`

Tests the Google OAuth login button component:
- ✅ Renders the login button
- ✅ Calls signInWithOAuth when clicked
- ✅ Sets loading state during authentication
- ✅ Handles OAuth errors gracefully
- ✅ Uses correct redirect URL from window origin

#### 14.2 Test Profile Creation on First Login
**File:** `app/auth/callback/route.test.ts`

Tests the OAuth callback handler and profile creation:
- ✅ Creates profile with Google OAuth data on first login
- ✅ Updates existing profile on subsequent login
- ✅ Includes updated_at timestamp in profile data
- ✅ Redirects to home page after successful authentication
- ✅ Handles profile creation errors gracefully
- ✅ Redirects to home even without code parameter
- ✅ Handles session exchange errors

#### 14.3 Test Route Protection
**File:** `middleware.test.ts`

Tests the authentication middleware and route protection:
- ✅ Redirects unauthenticated users to /login when accessing protected routes
- ✅ Allows unauthenticated users to access /login
- ✅ Allows unauthenticated users to access /auth/callback
- ✅ Redirects authenticated users from /login to home
- ✅ Allows authenticated users to access protected routes (/, /calendar, /tasks, /goals, /more)
- ✅ Creates Supabase client with correct configuration
- ✅ Refreshes session by calling getUser

#### 14.4 Test Logout Functionality
**File:** `actions/auth.test.ts`

Tests the logout server action:
- ✅ Calls Supabase signOut when logout is triggered
- ✅ Redirects to /login after successful logout
- ✅ Clears session by calling signOut
- ✅ Redirects even if signOut encounters an error
- ✅ Creates Supabase server client

### Integration Test
**File:** `tests/auth-flow.test.ts`

Documents the complete authentication flow and validates coverage of:
- Requirement 1: Google OAuth Authentication (7 acceptance criteria)
- Requirement 12: Data Security and Privacy (5 acceptance criteria)

## Authentication Flow

The complete authentication flow tested:

1. **Login Initiation**: User clicks "Sign in with Google" button
2. **OAuth Redirect**: Application redirects to Google for authentication
3. **Callback Handling**: Google redirects back to /auth/callback with code
4. **Session Exchange**: Callback handler exchanges code for session
5. **Profile Management**: Profile is created/updated with Google OAuth data
6. **Home Redirect**: User is redirected to home page
7. **Route Protection**: Middleware protects routes and manages redirects
8. **Logout**: User can logout to clear session and return to login page

## Writing Tests

### Unit Tests

Example unit test:
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Property-Based Tests

Example property-based test:
```typescript
import { describe, it, expect } from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { calendarEventArbitrary } from '@/tests/helpers/property-generators'

describe('Calendar Event Properties', () => {
  test.prop([calendarEventArbitrary])('should validate calendar events', (event) => {
    expect(event.title.length).toBeGreaterThan(0)
    expect(event.title.length).toBeLessThanOrEqual(100)
  })
})
```

### Integration Tests

Example integration test with database:
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createTestClient, cleanupTestData } from '@/lib/supabase/test-client'

describe('Calendar Integration Tests', () => {
  let testUserId: string

  beforeAll(async () => {
    testUserId = 'test-user-id'
  })

  afterAll(async () => {
    await cleanupTestData(testUserId)
  })

  it('should create a calendar event', async () => {
    const client = createTestClient()
    // Test implementation
  })
})
```

## Test Results

All tests pass successfully:
- Multiple test files covering authentication, components, and server actions
- Unit tests for components and utilities
- Integration tests for authentication flow
- Property-based tests for domain invariants (to be added in Phase 10)

## Requirements Validation

### Requirement 1: Google OAuth Authentication ✅
- Login page with Google OAuth as the only authentication method
- Profile record creation on successful authentication
- Redirect to home dashboard after login
- Store user's name, email, and avatar URL from Google OAuth
- Protect all application routes with authentication middleware
- Redirect unauthenticated users to login page
- Logout function that clears session and redirects to login

### Requirement 12: Data Security and Privacy ✅
- Row Level Security policies enforced
- Users can only access their own records
- All database operations through Server Actions
- Authentication validation before executing actions
- Authentication errors for unauthenticated requests

## Next Steps

See [TEST-DATABASE-SETUP.md](./TEST-DATABASE-SETUP.md) for:
- Setting up local Supabase for integration tests
- Configuring test database for CI/CD
- Running integration tests with real database
- Best practices for test data management
