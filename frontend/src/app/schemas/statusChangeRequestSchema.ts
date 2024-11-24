import { STATUSES } from '@/consts/student'
import { z } from 'zod'

export const statusChangeRequestSchema = z
  .object({
    type: z.enum(['休会', '退会', '再開']),
    reason: z.string().optional(),
    requestDate: z.date(),
    suspensionPeriod: z.number().optional(),
    studentStatus: z.enum(STATUSES).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.studentStatus === '受講中' && data.type === '再開') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '受講中の場合、再開は選択できません。',
        path: ['type'],
      })
    }
  })
