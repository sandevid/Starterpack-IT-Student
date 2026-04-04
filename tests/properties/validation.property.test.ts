import { describe, it, expect } from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { todoSchema } from '@/lib/validations/todo'
import { playlistSchema } from '@/lib/validations/playlist'

describe('Validation Properties', () => {
  /**
   * Feature: starterpack-it-student, Property 21: Todo Tag Validation
   * For any todo creation or update, the tag SHALL be one of the six valid values.
   */
  describe('Todo Tag Validation', () => {
    const validTags = ['math', 'english', 'science', 'ipa', 'ips', 'general'] as const

    test.prop([
      fc.constantFrom(...validTags),
      fc.string({ minLength: 1, maxLength: 200 }),
    ])('accepts valid tags', (validTag, title) => {
      const result = todoSchema.safeParse({ title, tag: validTag })
      expect(result.success).toBe(true)
    })

    test.prop([
      fc
        .string({ minLength: 1, maxLength: 50 })
        .filter((s) => !validTags.includes(s as any)),
      fc.string({ minLength: 1, maxLength: 200 }),
    ])('rejects invalid tags', (invalidTag, title) => {
      const result = todoSchema.safeParse({ title, tag: invalidTag })
      expect(result.success).toBe(false)
    })
  })

  /**
   * Feature: starterpack-it-student, Property 33: Playlist URL Validation
   * For any playlist creation or update, the URL SHALL contain "open.spotify.com".
   */
  describe('Playlist URL Validation', () => {
    test.prop([
      fc.string({ minLength: 1, maxLength: 100 }),
      fc.string({ minLength: 0, maxLength: 500 }),
    ])('accepts Spotify URLs', (name, description) => {
      // Use a fixed valid Spotify URL for testing
      const validUrl = 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'
      const result = playlistSchema.safeParse({ name, description, url: validUrl })
      expect(result.success).toBe(true)
    })

    test.prop([
      fc.string({ minLength: 1, maxLength: 100 }),
      fc.string({ minLength: 0, maxLength: 500 }),
      fc.webUrl({ validSchemes: ['https'] }).filter((url) => !url.includes('open.spotify.com')),
    ])('rejects non-Spotify URLs', (name, description, invalidUrl) => {
      const result = playlistSchema.safeParse({ name, description, url: invalidUrl })
      expect(result.success).toBe(false)
    })

    test.prop([fc.string({ minLength: 1, maxLength: 100 })])(
      'rejects invalid URL format',
      (name) => {
        const invalidUrl = 'not-a-url'
        const result = playlistSchema.safeParse({ name, url: invalidUrl })
        expect(result.success).toBe(false)
      }
    )
  })
})
