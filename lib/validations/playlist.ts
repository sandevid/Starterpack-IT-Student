import { z } from 'zod'

export const playlistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  url: z
    .string()
    .url('Invalid URL')
    .refine((url) => url.includes('open.spotify.com'), 'Must be a Spotify URL'),
})

export type PlaylistInput = z.infer<typeof playlistSchema>
