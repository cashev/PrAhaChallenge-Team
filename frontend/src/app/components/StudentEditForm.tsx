import { STATUSES } from '@/consts/student'
import { updateStudent } from '@/lib/backend/student'
import { getTeams } from '@/lib/backend/team'
import type { Student } from '@/lib/backend/types/student-type'
import type { GetTeamsResponse } from '@/lib/backend/types/team-type'
import { formatDate } from '@/util/dateUtils'
import type React from 'react'
import { useEffect, useState } from 'react'
import { Bounce, toast } from 'react-toastify'
import { studentSchema } from '../schemas/studentSchema'

interface StudentEditFormProps {
  student: Student
  onDataUpdate: () => void
}

const StudentEditForm: React.FC<StudentEditFormProps> = ({
  student,
  onDataUpdate,
}) => {
  const [formData, setFormData] = useState(student)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>({})
  const [teams, setTeams] = useState<GetTeamsResponse[]>([])
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const teamsData = await getTeams()
      setTeams(teamsData)
    }
    fetchData()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    if (name === 'Status') {
      setFormData({
        ...formData,
        Status: value,
        SuspensionStartDate:
          value === '受講中' || value === '退会済'
            ? undefined
            : formData.SuspensionStartDate,
        SuspensionEndDate:
          value === '受講中' || value === '退会済'
            ? undefined
            : formData.SuspensionEndDate,
        WithdrawalDate:
          value === '受講中' || value === '休会中'
            ? undefined
            : formData.WithdrawalDate,
      })
    } else if (name === 'TeamID') {
      setFormData({
        ...formData,
        [name]: value === '' ? undefined : Number(value),
        SeasonNumber: value === '' ? undefined : formData.SeasonNumber,
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const parsed = studentSchema.safeParse(formData)

    if (parsed.success) {
      try {
        await updateStudent(formData)
        setApiError(null)
        toast.success('受講生情報を保存しました。', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        })
        onDataUpdate()
      } catch (error) {
        console.error('受講生の保存中にエラーが発生しました:', error)
        setApiError('更新に失敗しました。もう一度お試しください。')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formErrors: any = {}
      parsed.error.errors.forEach((err) => {
        formErrors[err.path[0]] = err.message
      })
      setErrors(formErrors)
      setApiError(null)
      setIsSubmitting(false)
    }
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
            姓 <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            id="LastName"
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
            placeholder="姓"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-100"
          />
          {errors.LastName && (
            <p className="text-sm text-red-500">{errors.LastName}</p>
          )}
        </div>
        <div className="flex-1">
          <label
            htmlFor="FirstName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            名 <span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            id="FirstName"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange}
            placeholder="名"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-100"
          />
          {errors.FirstName && (
            <p className="text-sm text-red-500">{errors.FirstName}</p>
          )}
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
          type="text"
          id="SeasonNumber"
          name="SeasonNumber"
          value={formData.SeasonNumber ?? ''}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
          disabled
        />
      </div>

      <div>
        <label
          htmlFor="TeamID"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          チーム
        </label>
        <select
          id="TeamID"
          name="TeamID"
          value={formData.TeamID ?? ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-100"
        >
          <option value="">未所属</option>
          {teams?.map((team) => (
            <option key={team.ID} value={team.ID}>
              {team.SeasonNumber}-{team.Name}
            </option>
          ))}
        </select>
        {errors.TeamID && (
          <p className="text-sm text-red-500">{errors.TeamID}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="Status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          ステータス
        </label>
        <select
          id="Status"
          name="Status"
          value={formData.Status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-100"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {formData.Status === '休会中' && (
        <>
          <div>
            <label
              htmlFor="SuspensionStartDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              休会開始日 <span className="text-red-700">*</span>
            </label>
            <input
              type="date"
              id="SuspensionStartDate"
              name="SuspensionStartDate"
              value={formatDate(formData.SuspensionStartDate)}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-100"
            />
            {errors.SuspensionStartDate && (
              <p className="text-sm text-red-500">
                {errors.SuspensionStartDate}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="SuspensionEndDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              休会期限日 <span className="text-red-700">*</span>
            </label>
            <input
              type="date"
              id="SuspensionEndDate"
              name="SuspensionEndDate"
              value={formatDate(formData.SuspensionEndDate)}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-100"
            />
            {errors.SuspensionEndDate && (
              <p className="text-sm text-red-500">{errors.SuspensionEndDate}</p>
            )}
          </div>
        </>
      )}

      {formData.Status === '退会済' && (
        <div>
          <label
            htmlFor="WithdrawalDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            退会日 <span className="text-red-700">*</span>
          </label>
          <input
            type="date"
            id="WithdrawalDate"
            name="WithdrawalDate"
            value={formatDate(formData.WithdrawalDate)}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-100"
          />
          {errors.WithdrawalDate && (
            <p className="text-sm text-red-500">{errors.WithdrawalDate}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        {isSubmitting ? '保存中...' : '保存'}
      </button>
      {apiError && <p className="text-sm text-red-500">{apiError}</p>}
    </form>
  )
}

export default StudentEditForm
