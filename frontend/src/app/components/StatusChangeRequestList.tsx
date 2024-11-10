'use client'

import type { StatusChangeRequest } from '@/lib/backend/types/contact-type'
import { useState } from 'react'

interface StatusChangeRequestListProps {
  unprocessedRequests: StatusChangeRequest[]
  processedRequests: StatusChangeRequest[]
}

export default function StatusChangeRequestList({
  unprocessedRequests,
  processedRequests,
}: StatusChangeRequestListProps) {
  const [activeTab, setActiveTab] = useState<'未対応' | '対応済み'>('未対応')

  const renderRequestTable = (requests: StatusChangeRequest[]) => (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
            申請日時
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
            受講生
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
            種別
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
            希望日
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
            理由
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
        {requests
          .sort((a, b) => {
            return (
              new Date(b.SubmittedDate).getTime() -
              new Date(a.SubmittedDate).getTime()
            )
          })
          .map((request) => (
            <tr
              key={request.ID}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() =>
                (window.location.href = `/admin/supports/${request.ID}`)
              }
            >
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                {new Date(request.SubmittedDate).toLocaleString('ja-JP')}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                {request.StudentName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                {request.Type}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                {new Date(request.RequestDate).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                {request.Reason.length > 20
                  ? request.Reason.substring(0, 20) + '...'
                  : request.Reason}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  )

  return (
    <div>
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="-mb-px flex flex-wrap text-center text-sm font-medium">
          <li className="mr-2">
            <button
              className={`inline-block rounded-t-lg border-b-2 p-4 ${
                activeTab === '未対応'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('未対応')}
            >
              未対応 ({unprocessedRequests.length})
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block rounded-t-lg border-b-2 p-4 ${
                activeTab === '対応済み'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('対応済み')}
            >
              対応済み ({processedRequests.length})
            </button>
          </li>
        </ul>
      </div>
      <div className="overflow-x-auto">
        {activeTab === '未対応'
          ? renderRequestTable(unprocessedRequests)
          : renderRequestTable(processedRequests)}
      </div>
    </div>
  )
}
