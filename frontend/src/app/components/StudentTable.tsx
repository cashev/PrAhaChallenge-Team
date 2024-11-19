'use client'

import { PAGINATION } from '@/consts/pagination'
import { STATUSES } from '@/consts/student'
import type { Student } from '@/lib/backend/types/student-type'
import { ArrowLongDownIcon, ArrowLongUpIcon } from '@heroicons/react/16/solid'
import debounce from 'lodash.debounce'
import { usePathname, useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect, useState } from 'react'
import Pagination from './Pagination'
import StudentRow from './StudentRow'

interface StudentTableProps {
  students: Student[]
  totalCount: number
  searchParams: URLSearchParams
  onDataUpdate: () => void
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  totalCount,
  searchParams,
  onDataUpdate,
}) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const [filters, setFilters] = useState<{ [key: string]: string }>({})
  const currentPage =
    Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE
  const totalPages = Math.ceil(totalCount / PAGINATION.ITEMS_PER_PAGE)
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || '')
  const [sortOrder, setSortOrder] = useState<string>(
    searchParams.get('sortOrder') || '',
  )

  useEffect(() => {
    const initialFilters = Object.fromEntries(searchParams.entries())
    setFilters(initialFilters)
  }, [searchParams])

  const updateURLParams = debounce(
    (updatedFilters: { [key: string]: string }) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updatedFilters).forEach(([key, val]) => {
        if (val) {
          params.set(key, val)
        } else {
          params.delete(key)
        }
      })
      // フィルター変更時はページを1に戻す
      params.set('page', '1')
      replace(`${pathname}?${params.toString()}`)
    },
    300,
  )

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [field]: value }
      updateURLParams(updatedFilters)
      return updatedFilters
    })
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    replace(`${pathname}?${params.toString()}`)
  }

  const handleSortChange = (field: string) => {
    const newSortOrder =
      sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortBy(field)
    setSortOrder(newSortOrder)

    const params = new URLSearchParams(searchParams)
    params.set('sortBy', field)
    params.set('sortOrder', newSortOrder)
    params.set('page', '1')
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl">
        <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th
                className="cursor-pointer px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                onClick={() => handleSortChange('lastName')}
              >
                <div className="flex items-center">
                  <span>姓</span>
                  <span className="ml-1">
                    {sortBy === 'lastName' && sortOrder === 'asc' ? (
                      <ArrowLongUpIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongUpIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                  <span className="ml-1">
                    {sortBy === 'lastName' && sortOrder === 'desc' ? (
                      <ArrowLongDownIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongDownIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                </div>
              </th>
              <th
                className="cursor-pointer px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                onClick={() => handleSortChange('firstName')}
              >
                <div className="flex items-center">
                  <span>名</span>
                  <span className="ml-1">
                    {sortBy === 'firstName' && sortOrder === 'asc' ? (
                      <ArrowLongUpIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongUpIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                  <span className="ml-1">
                    {sortBy === 'firstName' && sortOrder === 'desc' ? (
                      <ArrowLongDownIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongDownIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                </div>
              </th>
              <th
                className="cursor-pointer px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                onClick={() => handleSortChange('seasonNumber')}
              >
                <div className="flex items-center">
                  <span>期</span>
                  <span className="ml-1">
                    {sortBy === 'seasonNumber' && sortOrder === 'asc' ? (
                      <ArrowLongUpIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongUpIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                  <span className="ml-1">
                    {sortBy === 'seasonNumber' && sortOrder === 'desc' ? (
                      <ArrowLongDownIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongDownIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                </div>
              </th>
              <th
                className="cursor-pointer px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                onClick={() => handleSortChange('teamName')}
              >
                <div className="flex items-center">
                  <span>チーム</span>
                  <span className="ml-1">
                    {sortBy === 'teamName' && sortOrder === 'asc' ? (
                      <ArrowLongUpIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongUpIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                  <span className="ml-1">
                    {sortBy === 'teamName' && sortOrder === 'desc' ? (
                      <ArrowLongDownIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongDownIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                </div>
              </th>
              <th
                className="cursor-pointer px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                onClick={() => handleSortChange('status')}
              >
                <div className="flex items-center">
                  <span>ステータス</span>
                  <span className="ml-1">
                    {sortBy === 'status' && sortOrder === 'asc' ? (
                      <ArrowLongUpIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongUpIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                  <span className="ml-1">
                    {sortBy === 'status' && sortOrder === 'desc' ? (
                      <ArrowLongDownIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongDownIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                </div>
              </th>
              <th
                className="cursor-pointer px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                onClick={() => handleSortChange('suspensionStartDate')}
              >
                <div className="flex items-center">
                  <span>休会開始日</span>
                  <span className="ml-1">
                    {sortBy === 'suspensionStartDate' && sortOrder === 'asc' ? (
                      <ArrowLongUpIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongUpIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                  <span className="ml-1">
                    {sortBy === 'suspensionStartDate' &&
                    sortOrder === 'desc' ? (
                      <ArrowLongDownIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongDownIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                </div>
              </th>
              <th
                className="cursor-pointer px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                onClick={() => handleSortChange('suspensionEndDate')}
              >
                <div className="flex items-center">
                  <span>休会期限日</span>
                  <span className="ml-1">
                    {sortBy === 'suspensionEndDate' && sortOrder === 'asc' ? (
                      <ArrowLongUpIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongUpIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                  <span className="ml-1">
                    {sortBy === 'suspensionEndDate' && sortOrder === 'desc' ? (
                      <ArrowLongDownIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongDownIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                </div>
              </th>
              <th
                className="cursor-pointer px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                onClick={() => handleSortChange('withdrawalDate')}
              >
                <div className="flex items-center">
                  <span>退会日</span>
                  <span className="ml-1">
                    {sortBy === 'withdrawalDate' && sortOrder === 'asc' ? (
                      <ArrowLongUpIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongUpIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                  <span className="ml-1">
                    {sortBy === 'withdrawalDate' && sortOrder === 'desc' ? (
                      <ArrowLongDownIcon className="size-5 text-blue-500" />
                    ) : (
                      <ArrowLongDownIcon className="size-5 text-gray-500" />
                    )}
                  </span>
                </div>
              </th>
            </tr>
            <tr>
              <th className="pb-2">
                <input
                  type="text"
                  value={filters.lastName || ''}
                  onChange={(e) =>
                    handleFilterChange('lastName', e.target.value)
                  }
                  className="w-11/12 rounded border border-gray-300 bg-gray-100 p-2 text-xs text-gray-600"
                />
              </th>
              <th className="pb-2">
                <input
                  type="text"
                  value={filters.firstName || ''}
                  onChange={(e) =>
                    handleFilterChange('firstName', e.target.value)
                  }
                  className="w-11/12 rounded border border-gray-300 bg-gray-100 p-2 text-xs text-gray-600"
                />
              </th>
              <th className="pb-2">
                <input
                  type="number"
                  value={filters.seasonNumber || ''}
                  onChange={(e) =>
                    handleFilterChange('seasonNumber', e.target.value)
                  }
                  className="w-11/12 rounded border border-gray-300 bg-gray-100 p-2 text-xs text-gray-600"
                />
              </th>
              <th className="pb-2">
                <input
                  type="text"
                  value={filters.teamName || ''}
                  onChange={(e) =>
                    handleFilterChange('teamName', e.target.value)
                  }
                  className="w-11/12 rounded border border-gray-300 bg-gray-100 p-2 text-xs text-gray-600"
                />
              </th>
              <th className="pb-2">
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-11/12 rounded border border-gray-300 bg-gray-100 p-2 text-xs text-gray-600"
                >
                  <option value="">全て</option>
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </th>
              <th className="pb-2">
                <input
                  type="text"
                  className="w-11/12 rounded border border-gray-300 bg-gray-100 p-2 text-xs text-gray-600 disabled:opacity-50"
                  disabled
                />
              </th>
              <th className="pb-2">
                <input
                  type="date"
                  value={filters.suspensionEndDate || ''}
                  onChange={(e) =>
                    handleFilterChange('suspensionEndDate', e.target.value)
                  }
                  className="w-11/12 rounded border border-gray-300 bg-gray-100 p-2 text-xs text-gray-600"
                />
              </th>
              <th className="pb-2">
                <input
                  type="month"
                  value={filters.withdrawalDate || ''}
                  onChange={(e) =>
                    handleFilterChange('withdrawalDate', e.target.value)
                  }
                  className="w-11/12 rounded border border-gray-300 bg-gray-100 p-2 text-xs text-gray-600"
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {students.length > 0
              ? students.map((student) => (
                  <StudentRow
                    key={student.StudentID}
                    student={student}
                    onDataUpdate={onDataUpdate}
                  />
                ))
              : null}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default StudentTable
