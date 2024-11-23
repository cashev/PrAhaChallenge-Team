'use client'

import { useRouter } from 'next/navigation'

interface ExistingStudent {
  studentId: number
  firstName: string
  lastName: string
  teamName: string
}

interface Student {
  firstName: string
  lastName: string
  email: string
  teamName: string
}

interface StudentConfirmationProps {
  seasonNumber: number
  onSubmit: (
    seasonNumber: number,
    assignmentsForExisting: ExistingStudent[],
    assignmentsForNew: Student[],
  ) => Promise<void>
}

const getAllTeams = (
  assignmentsForExisting: ExistingStudent[],
  assignmentsForNew: Student[],
) => {
  return new Set([
    ...assignmentsForExisting.map((s) => s.teamName),
    ...assignmentsForNew.map((s) => s.teamName),
  ])
}

const getChangedTeamStudentIds = (
  newAssignments: ExistingStudent[],
  originalAssignments: ExistingStudent[],
) => {
  return new Set(
    newAssignments
      .filter((assignment) => {
        const originalTeam = originalAssignments.find(
          (s) =>
            s.firstName === assignment.firstName &&
            s.lastName === assignment.lastName,
        )?.teamName
        return originalTeam && originalTeam !== assignment.teamName
      })
      .map((s) => s.studentId),
  )
}

const getExistingTeamNames = (existingStudents: ExistingStudent[]) => {
  return new Set(existingStudents.map((s) => s.teamName))
}

export default function StudentConfirmation({
  seasonNumber,
  onSubmit,
}: StudentConfirmationProps) {
  const router = useRouter()

  const existingStudents: ExistingStudent[] = JSON.parse(
    localStorage.getItem('register_existingStudents') || '[]',
  )
  const assignmentsForExisting: ExistingStudent[] = JSON.parse(
    localStorage.getItem('register_assignmentsForExisting') || '[]',
  )
  const assignmentsForNew: Student[] = JSON.parse(
    localStorage.getItem('register_assignmentsForNew') || '[]',
  )
  if (assignmentsForExisting.length === 0 && assignmentsForNew.length === 0) {
    router.push('/admin/students/register')
    return null
  }

  // 全てのチームを取得（新規と既存の両方）
  const allTeams = getAllTeams(assignmentsForExisting, assignmentsForNew)
  // チーム変更された既存受講生を特定
  const changedTeamStudentIds = getChangedTeamStudentIds(
    assignmentsForExisting,
    existingStudents,
  )
  // 既存のチーム名のセットを作成
  const existingTeamNames = getExistingTeamNames(existingStudents)

  const handleSubmit = async (
    seasonNumber: number,
    assignmentsForExisting: ExistingStudent[],
    assignmentsForNew: Student[],
  ) => {
    await onSubmit(seasonNumber, assignmentsForExisting, assignmentsForNew)
    localStorage.removeItem('register_studentInfos')
    localStorage.removeItem('register_existingStudents')
    localStorage.removeItem('register_assignmentsForExisting')
    localStorage.removeItem('register_assignmentsForNew')
    router.push(`/admin/students?seasonNumber=${seasonNumber}`)
  }

  const handleBack = (
    seasonNumber: number,
    existingStudents: ExistingStudent[],
    assignmentsForExisting: ExistingStudent[],
    assignmentsForNew: Student[],
  ) => {
    localStorage.setItem(
      'register_existingStudents',
      JSON.stringify(existingStudents),
    )
    localStorage.setItem(
      'register_assignmentsForExisting',
      JSON.stringify(assignmentsForExisting),
    )
    localStorage.setItem(
      'register_assignmentsForNew',
      JSON.stringify(assignmentsForNew),
    )
    router.push(`/admin/students/register/assign?season=${seasonNumber}`)
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        登録内容の確認
      </h1>

      <div className="mb-6 space-y-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {seasonNumber}期のチーム編成
        </h2>
        <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  チーム
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  名前
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  メールアドレス
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from(allTeams)
                .sort()
                .map((teamName) => {
                  const teamExistingStudents = assignmentsForExisting.filter(
                    (s) => s.teamName === teamName,
                  )
                  const teamNewStudents = assignmentsForNew.filter(
                    (s) => s.teamName === teamName,
                  )
                  const isNewTeam = !existingTeamNames.has(teamName)

                  return [...teamExistingStudents, ...teamNewStudents].map(
                    (student, index) => {
                      const isExisting = 'studentId' in student
                      const isTeamChanged =
                        isExisting &&
                        changedTeamStudentIds.has(student.studentId)

                      return (
                        <tr
                          key={`${teamName}-${index}`}
                          className="border-b border-gray-200 dark:border-gray-700"
                        >
                          {index === 0 && (
                            <td
                              rowSpan={
                                teamNewStudents.length +
                                teamExistingStudents.length
                              }
                              className={`px-4 py-2 text-gray-700 dark:text-gray-300
                                ${
                                  isNewTeam
                                    ? 'bg-blue-50 dark:bg-blue-900/20'
                                    : 'bg-white dark:bg-gray-800'
                                }`}
                            >
                              {teamName}
                            </td>
                          )}
                          <td
                            className={`px-4 py-2 ${
                              isTeamChanged
                                ? 'font-medium text-orange-600 dark:text-orange-400'
                                : 'text-gray-700 dark:text-gray-300'
                            } ${!isExisting ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                          >
                            {student.lastName} {student.firstName}
                          </td>
                          <td
                            className={`px-4 py-2 text-gray-700 dark:text-gray-300
                              ${!isExisting ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                          >
                            {'email' in student ? student.email : '-'}
                          </td>
                          <td
                            className={`px-4 py-2 text-sm text-gray-500 dark:text-gray-400
                              ${!isExisting ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                          >
                            {isExisting
                              ? isTeamChanged
                                ? '既存（チーム変更）'
                                : '既存'
                              : '新規'}
                          </td>
                        </tr>
                      )
                    },
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() =>
            handleBack(
              seasonNumber,
              existingStudents,
              assignmentsForExisting,
              assignmentsForNew,
            )
          }
          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          戻る
        </button>
        <button
          onClick={() =>
            handleSubmit(
              seasonNumber,
              assignmentsForExisting,
              assignmentsForNew,
            )
          }
          className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          登録する
        </button>
      </div>
    </div>
  )
}
