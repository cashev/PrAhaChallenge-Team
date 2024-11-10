import {
  getStatusChangeRequest,
  processStatusChangeRequest,
} from '@/lib/backend/contact'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function StatusChangeRequestDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const requestId = parseInt(params.id)
  const request = await getStatusChangeRequest(requestId)

  const handleProcess = async () => {
    'use server'
    await processStatusChangeRequest(requestId)
    revalidatePath('/admin/supports')
    redirect('/admin/supports')
  }

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          問い合わせ詳細
        </h1>
        <Link
          href="/admin/supports"
          className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          一覧へ戻る
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              受講生情報
            </h2>
            <div className="mt-2 space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">期：</span>
                {request.Season}期
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">チーム：</span>
                {request.TeamName}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">名前：</span>
                {request.StudentName}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              申請内容
            </h2>
            <div className="mt-2 space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">申請日時：</span>
                {new Date(request.SubmittedDate).toLocaleString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">申請種別：</span>
                {request.Type}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">希望日：</span>
                {new Date(request.RequestDate).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  理由：
                </p>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {request.Reason}
                </p>
              </div>
            </div>
          </div>

          {request.Status === '未対応' && (
            <form action={handleProcess}>
              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                対応済みにする
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
