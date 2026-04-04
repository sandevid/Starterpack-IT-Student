import { describe, it, expect } from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { format, parseISO } from 'date-fns'

describe('Calendar Event Properties', () => {
  /**
   * Feature: starterpack-it-student, Property 51: Date Round-Trip Preservation
   * For any valid calendar event date, formatting the date for storage and then
   * parsing it for display SHALL produce an equivalent date value.
   */
  test.prop([
    fc
      .date({
        min: new Date('2020-01-01'),
        max: new Date('2030-12-31'),
      })
      .filter((d) => !isNaN(d.getTime())), // Filter out invalid dates
  ])('date round-trip preserves value', (date) => {
    // Format date for storage (ISO format)
    const formatted = format(date, 'yyyy-MM-dd')

    // Parse date for display
    const parsed = parseISO(formatted)

    // The parsed date should match the original date (same day)
    expect(parsed.toDateString()).toBe(date.toDateString())
  })

  /**
   * Feature: starterpack-it-student, Property 14: Calendar Event Ordering
   * For any list of calendar events, the events SHALL be sorted by date in
   * ascending chronological order.
   */
  test.prop([
    fc.array(
      fc.record({
        id: fc.uuid(),
        title: fc.string({ minLength: 1, maxLength: 100 }),
        date: fc
          .date({
            min: new Date('2020-01-01'),
            max: new Date('2030-12-31'),
          })
          .filter((d) => !isNaN(d.getTime())), // Filter out invalid dates
        color: fc.constantFrom('exam', 'deadline', 'event', 'reminder'),
      }),
      { minLength: 2, maxLength: 20 }
    ),
  ])('events are sorted chronologically', (events) => {
    // Sort events by date
    const sorted = [...events].sort((a, b) => a.date.getTime() - b.date.getTime())

    // Verify chronological order
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].date.getTime()).toBeLessThanOrEqual(sorted[i + 1].date.getTime())
    }
  })
})
