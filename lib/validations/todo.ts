import { z } from 'zod'

export const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  tag: z.enum(['math', 'english', 'science', 'ipa', 'ips', 'general']),
})

export type TodoInput = z.infer<typeof todoSchema>
