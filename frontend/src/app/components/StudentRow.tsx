'use client'

import type { StudentList } from '@/lib/backend/types/student-type'
import { formatDate } from '@/util/dateUtils'
import type React from 'react'

interface StudentRowProps {
  student: StudentList
}

const StudentRow: React.FC<StudentRowProps> = ({ student }) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
        {student.LastName}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
        {student.FirstName}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
        {student.SeasonNumber ?? ''}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-100">
        {student.TeamName}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-100">
        {student.Status}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-100">
        {formatDate(student.SuspensionStartDate)}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-100">
        {formatDate(student.SuspensionEndDate)}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-100">
        {formatDate(student.WithdrawalDate)}
      </td>
    </tr>
  )
}

export default StudentRow
