import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import StatusChangeRequestForm from '@/app/components/StatusChangeRequestForm'
import { submitStatusChangeRequest } from '@/lib/backend/contact'
import { getStudentInfo } from '@/lib/backend/student'
import type { StatusChangeType } from '@/lib/backend/types/contact-type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function StatusChangePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.user.id) {
    redirect('/student/login')
  }

  const studentInfo = await getStudentInfo(session.user.id)

  async function handleSubmit(
    type: StatusChangeType,
    reason: string,
    requestDate: Date,
    suspensionPeriod?: number,
  ) {
    'use server'
    const session = await getServerSession(authOptions)
    if (!session?.accessToken || !session.user.id) {
      throw new Error('認証エラー')
    }

    await submitStatusChangeRequest(
      session.accessToken,
      Number(session.user.id),
      type,
      reason,
      requestDate,
      Number(suspensionPeriod),
    )
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        お問い合わせ
      </h1>
      <div className="my-4">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          休会・退会・再開申請
        </h2>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <StatusChangeRequestForm
            onSubmit={handleSubmit}
            student={studentInfo}
          />
        </div>
      </div>
    </div>
  )
}
