import { describe, it, expect } from 'vitest'
import { fc, test } from '@fast-check/vitest'

// Helper function to calculate goal progress
function calculateGoalProgress(steps: Array<{ completed: boolean }>): number {
  if (steps.length === 0) return 0
  const completedCount = steps.filter((s) => s.completed).length
  return Math.round((completedCount / steps.length) * 100)
}

describe('Goal Properties', () => {
  /**
   * Feature: starterpack-it-student, Property 23: Goal Progress Calculation
   * For any goal with steps, the progress percentage SHALL equal
   * (completed steps / total steps) × 100, bounded between 0 and 100.
   */
  test.prop([
    fc.array(
      fc.record({
        id: fc.uuid(),
        title: fc.string({ minLength: 1, maxLength: 200 }),
        completed: fc.boolean(),
      }),
      { minLength: 0, maxLength: 20 }
    ),
  ])('progress calculation is accurate and bounded', (steps) => {
    const progress = calculateGoalProgress(steps)

    // Progress must be between 0 and 100
    expect(progress).toBeGreaterThanOrEqual(0)
    expect(progress).toBeLessThanOrEqual(100)

    // Verify calculation accuracy
    if (steps.length === 0) {
      expect(progress).toBe(0)
    } else {
      const completedCount = steps.filter((s) => s.completed).length
      const expected = Math.round((completedCount / steps.length) * 100)
      expect(progress).toBe(expected)
    }
  })

  /**
   * Feature: starterpack-it-student, Property 31: Goal Progress Boundary Cases
   * For any goal with all steps completed, the progress SHALL be 100%.
   * For any goal with no steps, the progress SHALL be 0%.
   */
  test.prop([fc.integer({ min: 1, max: 20 })])(
    'progress is 100% when all steps complete, 0% when no steps',
    (stepCount) => {
      // All completed
      const allCompleted = Array(stepCount)
        .fill(null)
        .map((_, i) => ({
          id: `step-${i}`,
          title: `Step ${i}`,
          completed: true,
        }))
      expect(calculateGoalProgress(allCompleted)).toBe(100)

      // None completed
      const noneCompleted = Array(stepCount)
        .fill(null)
        .map((_, i) => ({
          id: `step-${i}`,
          title: `Step ${i}`,
          completed: false,
        }))
      expect(calculateGoalProgress(noneCompleted)).toBe(0)

      // No steps
      expect(calculateGoalProgress([])).toBe(0)
    }
  )
})
