import { PAGINATION } from '@/consts/pagination'
import type React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  handlePageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  handlePageChange,
}) => {
  let pageNumbers: (number | string)[] = []

  if (totalPages <= PAGINATION.MAX_BUTTONS) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
  } else {
    const start = Math.max(2, currentPage - 2)
    const end = Math.min(totalPages - 1, currentPage + 2)

    pageNumbers = [1]

    if (start > 2) {
      pageNumbers.push('...')
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i)
    }

    if (end < totalPages - 1) {
      pageNumbers.push('...')
    }

    pageNumbers.push(totalPages)
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-900 transition hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      >
        前へ
      </button>

      <div className="flex gap-1">
        {pageNumbers.map((num, index) =>
          num === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={num}
              onClick={() => handlePageChange(num as number)}
              className={`rounded px-3 py-1 transition ${
                currentPage === num
                  ? 'bg-blue-500 text-white dark:bg-blue-600'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {num}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-900 transition hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      >
        次へ
      </button>

      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {totalCount}件中 {(currentPage - 1) * PAGINATION.ITEMS_PER_PAGE + 1}〜
        {Math.min(currentPage * PAGINATION.ITEMS_PER_PAGE, totalCount)} 件を表示
      </span>
    </div>
  )
}

export default Pagination
