'use client'

import type { StudentList } from '@/lib/backend/types/student-type'
import { formatDate } from '@/util/dateUtils'
import type React from 'react'
import { useState } from 'react'
import RightDrawerDialog from './RightDrawerDialog'
import StudentEditForm from './StudentEditForm'

interface StudentRowProps {
  student: StudentList
}

const StudentRow: React.FC<StudentRowProps> = ({ student }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDialogOpen = () => {
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
  }

  return (
    <>
      <tr
        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={() => {
          handleDialogOpen()
        }}
      >
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
      <RightDrawerDialog isOpen={isDialogOpen} onClose={handleDialogClose}>
        <StudentEditForm student={student} onSubmit={() => null} />
      </RightDrawerDialog>
    </>
  )
}

export default StudentRow
