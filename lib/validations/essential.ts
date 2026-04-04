import { z } from 'zod'

export const essentialSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  icon: z.enum([
    'Laptop',
    'Headphones',
    'BookOpen',
    'Pen',
    'Backpack',
    'Watch',
    'Glasses',
    'Coffee',
    'Package',
    'Star',
  ]),
  category: z.enum(['gadget', 'stationery', 'fashion', 'book', 'general']),
  image_url: z.string().url('Invalid image URL').optional().or(z.literal('')),
})

export type EssentialInput = z.infer<typeof essentialSchema>
