import StudentConfirmation from '@/app/components/StudentConfirmation'
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

  const data = temporaryStore.getData(searchParams.id)
  if (!data) {
    redirect('/admin/students/register')
  }

  async function handleSubmit(
    seasonNumber: number,
    assignments: {
      firstName: string
      lastName: string
      email: string
      teamName: string
    }[],
  ) {
    'use server'

    const groupedStudents = assignments.reduce(
      (acc, student) => {
        const teamName = student.teamName
        if (!acc[teamName]) {
          acc[teamName] = []
        }
        acc[teamName].push(student)
        return acc
      },
      {} as Record<
        string,
        { firstName: string; lastName: string; email: string }[]
      >,
    )

    const teams = Object.entries(groupedStudents).map(
      ([teamName, students]) => ({
        TeamName: teamName,
        Students: students.map((student) => ({
          FirstName: student.firstName,
          LastName: student.lastName,
          Email: student.email,
        })),
      }),
    )

    const request = {
      SeasonNumber: seasonNumber,
      Teams: teams,
    }
    await registerStudents(request)
    redirect(`/admin/students?seasonNumber=${seasonNumber}`)
  }

  async function handleBack(
    seasonNumber: number,
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
    })
    redirect(`/admin/students/register/team?id=${storeId}`)
  }

  return (
    <StudentConfirmation
      seasonNumber={data.seasonNumber}
      students={data.students}
      handleBack={handleBack}
      handleSubmit={handleSubmit}
    />
  )
}
