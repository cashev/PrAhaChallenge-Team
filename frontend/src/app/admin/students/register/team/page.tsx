import TeamAssignment from '@/app/components/TeamAssignment'
import { temporaryStore } from '@/util/temporary-store'
import { redirect } from 'next/navigation'

export default function TeamAssignmentPage({
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

  async function handleSubmit(
    assignments: {
      firstName: string
      lastName: string
      email: string
      teamName: string
    }[],
  ) {
    'use server'
    const storeId = temporaryStore.setStudents(assignments)
    redirect(`/admin/students/register/confirm?id=${storeId}`)
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          チーム割り当て
        </h1>
        <TeamAssignment students={students} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
