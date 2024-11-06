'use client'

import type { StudentsResponse } from '@/lib/backend/types/student-type'
import debounce from 'lodash.debounce'
import { usePathname, useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect, useState } from 'react'
import StudentRow from './StudentRow'

interface StudentTableProps {
  students: StudentsResponse[]
  searchParams: URLSearchParams
}

const statuses = ['受講中', '休会中', '退会済']

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  searchParams,
}) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const [filters, setFilters] = useState<{ [key: string]: string }>({})

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

  useEffect(() => {
    const initialFilters = Object.fromEntries(searchParams.entries())
    setFilters(initialFilters)
  }, [searchParams])

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl">
        <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                姓
              </th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                名
              </th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                期
              </th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                チーム
              </th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                受講ステータス
              </th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                休会開始日
              </th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                休会期限日
              </th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                退会日
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
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </th>
              <th className="pb-2">
                <input
                  type="date"
                  value={filters.suspensionStartDate || ''}
                  onChange={(e) =>
                    handleFilterChange('suspensionStartDate', e.target.value)
                  }
                  className="w-11/12 rounded border border-gray-300 bg-gray-100 p-2 text-xs text-gray-600"
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
                  type="date"
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
                  <StudentRow key={student.StudentID} student={student} />
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentTable
