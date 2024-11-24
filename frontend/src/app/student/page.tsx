import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import {
  getStudentInfo,
  getStudentStatusChangeRequest,
} from '@/lib/backend/student'
import { getServerSession } from 'next-auth/next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function StudentPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.user.id) {
    redirect('/student/login')
  }

  const studentInfo = await getStudentInfo(session.user.id)
  const statusChangeRequest = await getStudentStatusChangeRequest(
    studentInfo.StudentID,
  )

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            受講生ダッシュボード
          </h1>
        </div>
        <div className="overflow-hidden bg-white shadow sm:rounded-lg dark:bg-gray-800">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white">
              受講生情報
            </h2>
            {statusChangeRequest && (
              <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:border-yellow-600 dark:bg-yellow-900">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  現在、{statusChangeRequest.Type}
                  申請中です。処理が完了するまでお待ちください。
                </p>
              </div>
            )}
            <div className="mt-2 space-y-4">
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">期：</span>
                  {studentInfo.Season}
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">チーム：</span>
                  {studentInfo.TeamName}
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">名前：</span>
                  {studentInfo.FirstName} {studentInfo.LastName}
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">ステータス：</span>
                  {studentInfo.Status}
                </p>
              </div>
              <Link
                href="/student/tasks"
                className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                課題一覧へ
              </Link>
              <div className="my-4"></div>
              <Link
                href="/student/contact"
                className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                お問い合わせへ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
