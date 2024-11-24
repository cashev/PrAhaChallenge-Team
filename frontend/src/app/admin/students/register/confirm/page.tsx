import StudentConfirmation from '@/app/components/StudentConfirmation'
import { registerStudents } from '@/lib/backend/student'
import { redirect } from 'next/navigation'

const handleSubmit = async (
  seasonNumber: number,
  assignmentsForExisting: {
    studentId: number
    firstName: string
    lastName: string
    teamName: string
  }[],
  assignmentsForNew: {
    firstName: string
    lastName: string
    email: string
    teamName: string
  }[],
) => {
  'use server'

  const groupedStudents = assignmentsForExisting.reduce(
    (acc, assignment) => {
      const teamName = assignment.teamName
      if (!acc[teamName]) {
        acc[teamName] = {
          existingStudents: [],
          newStudents: [],
        }
      }
      acc[teamName].existingStudents.push({
        studentId: assignment.studentId,
        firstName: assignment.firstName,
        lastName: assignment.lastName,
      })
      return acc
    },
    {} as Record<
      string,
      {
        existingStudents: {
          studentId: number
          firstName: string
          lastName: string
        }[]
        newStudents: {
          firstName: string
          lastName: string
          email: string
        }[]
      }
    >,
  )

  assignmentsForNew.forEach((assignment) => {
    const teamName = assignment.teamName
    if (!groupedStudents[teamName]) {
      groupedStudents[teamName] = {
        existingStudents: [],
        newStudents: [],
      }
    }
    groupedStudents[teamName].newStudents.push({
      firstName: assignment.firstName,
      lastName: assignment.lastName,
      email: assignment.email,
    })
  })

  const teams = Object.entries(groupedStudents).map(
    ([teamName, { existingStudents, newStudents }]) => ({
      TeamName: teamName,
      Students: newStudents.map((student) => ({
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
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: { season: number }
}) {
  if (!searchParams.season) {
    redirect('/admin/students/register')
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      <StudentConfirmation
        seasonNumber={Number(searchParams.season)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
