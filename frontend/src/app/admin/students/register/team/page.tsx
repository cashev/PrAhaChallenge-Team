import TeamAssignment from '@/app/components/TeamAssignment'
import { getStudentsBySeason } from '@/lib/backend/student'
import { temporaryStore } from '@/util/temporary-store'
import { redirect } from 'next/navigation'

export default async function TeamAssignmentPage({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  if (!searchParams.id) {
    redirect('/admin/students/register')
  }

  const data = temporaryStore.getData(searchParams.id)
  if (!data) {
    redirect('/admin/students/register')
  }

  // 既存の受講生を取得
  const existingStudents = await getStudentsBySeason(data.seasonNumber)

  async function handleSubmit(
    seasonNumber: number,
    existingStudents: {
      studentId: number
      firstName: string
      lastName: string
      teamName: string
    }[],
    existingAssignments: {
      studentId: number
      firstName: string
      lastName: string
      teamName: string
    }[],
    assignments: {
      firstName: string
      lastName: string
      email: string
      teamName: string
    }[],
  ) {
    'use server'
    const storeId = temporaryStore.setData({
      seasonNumber,
      students: assignments,
      existingStudents,
      existingAssignments,
    })
    redirect(`/admin/students/register/confirm?id=${storeId}`)
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          チーム割り当て
        </h1>
        <TeamAssignment
          seasonNumber={data.seasonNumber}
          students={data.students}
          existingStudents={existingStudents.map((student) => ({
            studentId: student.StudentID,
            firstName: student.FirstName,
            lastName: student.LastName,
            teamName: student.TeamName,
          }))}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
