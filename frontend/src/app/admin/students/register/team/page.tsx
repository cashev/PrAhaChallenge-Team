import TeamAssignment from '@/app/components/TeamAssignment'
import { getStudentsBySeason } from '@/lib/backend/student'

const doGetStudents = async (seasonNumber: number) => {
  'use server'
  const existingStudents = await getStudentsBySeason(seasonNumber)
  return existingStudents.map((student) => ({
    studentId: student.StudentID,
    firstName: student.FirstName,
    lastName: student.LastName,
    teamName: student.TeamName,
  }))
}

export default async function TeamAssignmentPage({
  searchParams,
}: {
  searchParams: { season: number }
}) {
  // 既存の受講生を取得
  const existingStudents = await doGetStudents(searchParams.season)

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          チーム割り当て
        </h1>
        <TeamAssignment
          seasonNumber={searchParams.season}
          existingStudents={existingStudents}
        />
      </div>
    </div>
  )
}
