import StudentConfirmation from '@/app/components/StudentConfirmation'
import { getNextSeasonNumber } from '@/lib/backend/season'
import { registerStudents } from '@/lib/backend/student'
import { temporaryStore } from '@/util/temporary-store'
import { redirect } from 'next/navigation'

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  if (!searchParams.id) {
    redirect('/admin/students/register')
  }

  const students = temporaryStore.getStudents(searchParams.id)
  if (!students) {
    redirect('/admin/students/register')
  }

  const nextSeasonNumber = await getNextSeasonNumber()

  async function handleSubmit(
    assignments: { firstName: string; lastName: string; teamName?: string }[],
  ) {
    'use server'

    const groupedStudents = assignments.reduce(
      (acc, student) => {
        const teamName = student.teamName || '未所属'
        if (!acc[teamName]) {
          acc[teamName] = []
        }
        acc[teamName].push(student)
        return acc
      },
      {} as Record<string, { firstName: string; lastName: string }[]>,
    )

    const teams = Object.entries(groupedStudents).map(
      ([teamName, students]) => ({
        TeamName: teamName,
        Students: students.map((student) => ({
          FirstName: student.firstName,
          LastName: student.lastName,
        })),
      }),
    )

    const request = {
      SeasonNumber: nextSeasonNumber,
      Teams: teams,
    }
    await registerStudents(request)
    redirect(`/admin/students?seasonNumber=${nextSeasonNumber}`)
  }

  async function handleBack(
    assignments: { firstName: string; lastName: string; teamName?: string }[],
  ) {
    'use server'
    const storeId = temporaryStore.setStudents(assignments)
    redirect(`/admin/students/register/team?id=${storeId}`)
  }

  return (
    <StudentConfirmation
      nextSeasonNumber={nextSeasonNumber}
      students={students}
      handleBack={handleBack}
      handleSubmit={handleSubmit}
    />
  )
}
