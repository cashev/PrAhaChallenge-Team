'use client'

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
  students: Student[]
  existingStudents: ExistingStudent[]
  existingAssignments: ExistingStudent[]
  handleSubmit: (
    seasonNumber: number,
    existingStudents: ExistingStudent[],
    students: Student[],
  ) => Promise<void>
  handleBack: (
    seasonNumber: number,
    existingStudents: ExistingStudent[],
    existingAssignments: ExistingStudent[],
    students: Student[],
  ) => Promise<void>
}

export default function StudentConfirmation({
  seasonNumber,
  students,
  existingStudents,
  existingAssignments,
  handleSubmit,
  handleBack,
}: StudentConfirmationProps) {
  // 全てのチームを取得（新規と既存の両方）
  const allTeams = new Set([
    ...existingAssignments.map((s) => s.teamName),
    ...students.map((s) => s.teamName || '未所属'),
  ])

  // チーム変更された既存受講生を特定
  const changedTeamStudents = new Set(
    existingAssignments
      .filter((existing) => {
        const originalTeam = existingStudents.find(
          (s) =>
            s.firstName === existing.firstName &&
            s.lastName === existing.lastName,
        )?.teamName
        return originalTeam && originalTeam !== existing.teamName
      })
      .map((s) => `${s.firstName}${s.lastName}`),
  )

  // 既存のチーム名のセットを作成
  const existingTeamNames = new Set(existingStudents.map((s) => s.teamName))

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
              {Array.from(allTeams).map((teamName) => {
                const teamStudents = students.filter(
                  (s) => s.teamName === teamName,
                )
                const teamExistingStudents = existingAssignments.filter(
                  (s) => s.teamName === teamName,
                )
                const isNewTeam = !existingTeamNames.has(teamName)

                return [...teamExistingStudents, ...teamStudents].map(
                  (student, index) => {
                    const isExisting = 'studentId' in student
                    const isTeamChanged =
                      isExisting &&
                      changedTeamStudents.has(
                        `${student.firstName}${student.lastName}`,
                      )

                    return (
                      <tr
                        key={`${teamName}-${index}`}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        {index === 0 && (
                          <td
                            rowSpan={
                              teamStudents.length + teamExistingStudents.length
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
              existingAssignments,
              students,
            )
          }
          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          戻る
        </button>
        <button
          onClick={() =>
            handleSubmit(seasonNumber, existingAssignments, students)
          }
          className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          登録する
        </button>
      </div>
    </div>
  )
}
