import { fc } from '@fast-check/vitest'
import type { EventColor, TodoTag, EssentialIcon, EssentialCategory } from '@/types/database.types'

/**
 * Property-based testing generators for domain types
 */

// Calendar event generators
export const eventColorArbitrary = fc.constantFrom<EventColor>(
  'exam',
  'deadline',
  'event',
  'reminder'
)

export const calendarEventArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  date: fc.date().map((d) => d.toISOString().split('T')[0]),
  notes: fc.option(fc.string({ maxLength: 500 }), { nil: null }),
  color: eventColorArbitrary,
})

// Todo generators
export const todoTagArbitrary = fc.constantFrom<TodoTag>(
  'math',
  'english',
  'science',
  'ipa',
  'ips',
  'general'
)

export const todoArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 200 }),
  completed: fc.boolean(),
  tag: todoTagArbitrary,
})

// Goal generators
export const goalArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 200 }),
})

export const goalStepArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 200 }),
  completed: fc.boolean(),
})

// Playlist generators
export const spotifyUrlArbitrary = fc
  .string({ minLength: 10, maxLength: 50 })
  .map((id) => `https://open.spotify.com/playlist/${id}`)

export const playlistArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.option(fc.string({ maxLength: 500 }), { nil: null }),
  url: spotifyUrlArbitrary,
})

// Essential generators
export const essentialIconArbitrary = fc.constantFrom<EssentialIcon>(
  'Laptop',
  'Headphones',
  'BookOpen',
  'Pen',
  'Backpack',
  'Watch',
  'Glasses',
  'Coffee',
  'Package',
  'Star'
)

export const essentialCategoryArbitrary = fc.constantFrom<EssentialCategory>(
  'gadget',
  'stationery',
  'fashion',
  'book',
  'general'
)

export const essentialArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.option(fc.string({ maxLength: 500 }), { nil: null }),
  icon: essentialIconArbitrary,
  category: essentialCategoryArbitrary,
})

// Date generators for testing date handling
export const validDateStringArbitrary = fc
  .date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
  .map((d) => d.toISOString().split('T')[0])

// Progress percentage generator (0-100)
export const progressPercentageArbitrary = fc.integer({ min: 0, max: 100 })

// Goal with steps generator for testing progress calculation
export const goalWithStepsArbitrary = fc
  .tuple(
    goalArbitrary,
    fc.array(goalStepArbitrary, { minLength: 0, maxLength: 10 })
  )
  .map(([goal, steps]) => ({
    ...goal,
    steps,
  }))
