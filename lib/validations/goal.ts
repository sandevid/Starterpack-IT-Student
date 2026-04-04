import { z } from 'zod'

export const goalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
})

export const goalStepSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  goal_id: z.string().uuid('Invalid goal ID'),
})

export type GoalInput = z.infer<typeof goalSchema>
export type GoalStepInput = z.infer<typeof goalStepSchema>
