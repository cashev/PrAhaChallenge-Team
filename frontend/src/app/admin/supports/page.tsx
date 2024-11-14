import StatusChangeRequestList from '@/app/components/StatusChangeRequestList'
import {
  getProcessedStatusChangeRequests,
  getUnprocessedStatusChangeRequests,
} from '@/lib/backend/contact'
import { Suspense } from 'react'

export default async function ContactsPage() {
  const unprocessedRequests = await getUnprocessedStatusChangeRequests()
  const processedRequests = await getProcessedStatusChangeRequests()

  return (
    <div className="mx-auto max-w-7xl py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        問い合わせ一覧
      </h1>
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="px-4 py-5 sm:p-6">
          <Suspense fallback={<div>読み込み中...</div>}>
            <StatusChangeRequestList
              unprocessedRequests={unprocessedRequests}
              processedRequests={processedRequests}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
