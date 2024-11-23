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

    const groupedStudents = assignments.reduce(
      (acc, student) => {
        const teamName = student.teamName
        if (!acc[teamName]) {
          acc[teamName] = {
            students: [],
            existingStudents: [],
          }
        }
        acc[teamName].students.push(student)
        return acc
      },
      {} as Record<
        string,
        {
          students: { firstName: string; lastName: string; email: string }[]
          existingStudents: {
            studentId: number
            firstName: string
            lastName: string
          }[]
        }
      >,
    )

    existingAssignments.forEach((student) => {
      const teamName = student.teamName
      if (!groupedStudents[teamName]) {
        groupedStudents[teamName] = {
          students: [],
          existingStudents: [],
        }
      }
      groupedStudents[teamName].existingStudents.push({
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
      })
    })

    const teams = Object.entries(groupedStudents).map(
      ([teamName, { students, existingStudents }]) => ({
        TeamName: teamName,
        Students: students.map((student) => ({
          FirstName: student.firstName,
          LastName: student.lastName,
          Email: student.email,
        })),
        ExistingStudents: existingStudents.map((student) => ({
          StudentID: student.studentId,
          FirstName: student.firstName,
          LastName: student.lastName,
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
      existingStudents: existingAssignments,
    })
    redirect(`/admin/students/register/team?id=${storeId}`)
  }

  return (
    <StudentConfirmation
      seasonNumber={data.seasonNumber}
      students={data.students}
      existingStudents={data.existingStudents}
      handleBack={handleBack}
      handleSubmit={handleSubmit}
    />
  )
}
