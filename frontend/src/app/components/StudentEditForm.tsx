import { STATUSES } from '@/consts/student'
import type { StudentList } from '@/lib/backend/types/student-type'
import { formatDate } from '@/util/dateUtils'
import type React from 'react'
import { useState } from 'react'

interface StudentEditFormProps {
  student: StudentList
  onSubmit: (updatedStudent: StudentList) => void
}

const StudentEditForm: React.FC<StudentEditFormProps> = ({
  student,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(student)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
      <h2 className="mb-4 text-2xl font-bold">受講生編集</h2>

      <input type="hidden" name="studentID" value={formData.StudentID} />

      <div className="flex space-x-4">
        <div className="flex-1">
          <label
            htmlFor="LastName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            姓
          </label>
          <input
            type="text"
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
            placeholder="姓"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="FirstName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            名
          </label>
          <input
            type="text"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange}
            placeholder="名"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="SeasonNumber"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          期
        </label>
        <input
          type="number"
          name="SeasonNumber"
          value={formData.SeasonNumber}
          onChange={handleChange}
          placeholder="期"
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="TeamName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          チーム
        </label>
        <input
          type="text"
          name="TeamName"
          value={formData.TeamName}
          onChange={handleChange}
          placeholder="チーム"
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="Status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          ステータス
        </label>
        <select
          name="Status"
          value={formData.Status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="SuspensionStartDate"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          休会開始日
        </label>
        <input
          type="date"
          name="SuspensionStartDate"
          value={formatDate(formData.SuspensionStartDate)}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="SuspensionEndDate"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          休会期限日
        </label>
        <input
          type="date"
          name="SuspensionEndDate"
          value={formatDate(formData.SuspensionEndDate)}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="WithdrawalDate"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          退会日
        </label>
        <input
          type="date"
          name="WithdrawalDate"
          value={formatDate(formData.WithdrawalDate)}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        保存
      </button>
    </form>
  )
}

export default StudentEditForm
