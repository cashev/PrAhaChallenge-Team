import { z } from 'zod'

export const studentSchema = z
  .object({
    LastName: z.string().min(1, '姓は必須です'),
    FirstName: z.string().min(1, '名は必須です'),
    TeamID: z.number().nullable().optional(),
    SeasonID: z.number().nullable().optional(),
    Status: z.enum(['受講中', '休会中', '退会済']),
    WithdrawalDate: z.string().nullable().optional(),
    SuspensionStartDate: z.string().nullable().optional(),
    SuspensionEndDate: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    // 受講中の場合は期・チーム名が必須
    if (data.Status === '受講中') {
      if (!data.SeasonID) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '受講中の場合、期は必須です',
          path: ['SeasonID'],
        })
      }
      if (!data.TeamID) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '受講中の場合、チーム名は必須です',
          path: ['TeamID'],
        })
      }
    }

    // 退会済の場合は退会日が必須
    if (data.Status === '退会済') {
      if (!data.WithdrawalDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '退会済の場合、退会日は必須です',
          path: ['WithdrawalDate'],
        })
      }
    }

    // 休会中の場合は休会開始日と休会期限日が必須
    if (data.Status === '休会中') {
      if (!data.SuspensionStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '休会中の場合、休会開始日は必須です',
          path: ['SuspensionStartDate'],
        })
      }
      if (!data.SuspensionEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '休会中の場合、休会期限日は必須です',
          path: ['SuspensionEndDate'],
        })
      }

      // 休会期限日と開始日の比較（両方の値が存在する場合のみ）
      if (data.SuspensionStartDate && data.SuspensionEndDate) {
        const startDate = new Date(data.SuspensionStartDate)
        const endDate = new Date(data.SuspensionEndDate)

        if (endDate <= startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '休会期限日は休会開始日より後の日付を指定してください',
            path: ['SuspensionEndDate'],
          })
        }
      }
    }

    if (['休会中', '退会済'].includes(data.Status) && data.TeamID) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '休会中または退会済の場合、チームは空でなければいけません',
        path: ['TeamID'],
      })
    }
  })
