'use client'

interface Student {
  firstName: string
  lastName: string
  email: string
  teamName: string
}

interface StudentConfirmationProps {
  seasonNumber: number
  students: Student[]
  handleSubmit: (seasonNumber: number, students: Student[]) => Promise<void>
  handleBack: (seasonNumber: number, students: Student[]) => Promise<void>
}

export default function StudentConfirmation({
  seasonNumber,
  students,
  handleSubmit,
  handleBack,
}: StudentConfirmationProps) {
  const groupedStudents = students.reduce(
    (acc, student) => {
      const teamName = student.teamName || '未所属'
      if (!acc[teamName]) {
        acc[teamName] = []
      }
      acc[teamName].push(student)
      return acc
    },
    {} as Record<string, Student[]>,
  )

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          登録内容の確認
        </h1>

        <div className="mb-6 space-y-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {seasonNumber}期に登録する受講生一覧
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
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedStudents).map(
                  ([teamName, teamStudents]) =>
                    teamStudents.map((student, studentIndex) => (
                      <tr
                        key={`${teamName}-${studentIndex}`}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        {studentIndex === 0 && (
                          <td
                            rowSpan={teamStudents.length}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300"
                          >
                            {teamName}
                          </td>
                        )}
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                          {student.lastName} {student.firstName}
                        </td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                          {student.email}
                        </td>
                      </tr>
                    )),
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => handleBack(seasonNumber, students)}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            戻る
          </button>
          <button
            onClick={() => handleSubmit(seasonNumber, students)}
            className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            登録する
          </button>
        </div>
      </div>
    </div>
  )
}
