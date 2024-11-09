import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import TaskProgressTable from '@/app/components/TaskProgressTable'
import { getTasksByStudent, updateTaskProgress } from '@/lib/backend/task'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type React from 'react'

async function getTasks(token: string) {
  try {
    const { tasks, teams } = await getTasksByStudent(token)
    const sortedTasks = tasks.sort((a, b) => {
      if (a.GenreDisplayOrder === b.GenreDisplayOrder) {
        return a.DisplayOrder - b.DisplayOrder
      }
      return a.GenreDisplayOrder - b.GenreDisplayOrder
    })
    return { tasks: sortedTasks, teams }
  } catch (error) {
    console.error('課題の取得に失敗しました:', error)
    throw new Error('課題の取得に失敗しました')
  }
}

const handleUpdateTaskProgress = async (
  taskID: number,
  studentID: number,
  status: string,
) => {
  'use server'
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    redirect('/login')
  }
  await updateTaskProgress(session.accessToken, taskID, studentID, status)
  revalidatePath('/student/tasks')
}

const StudentTasksPage: React.FC = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    redirect('/login')
  }

  const { tasks, teams } = await getTasks(session.accessToken)

  return (
    <div className="overflow-x-auto bg-white shadow sm:rounded-lg dark:bg-gray-800">
      <div className="px-4 py-5 sm:p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          課題進捗一覧
        </h1>
        <TaskProgressTable
          tasks={tasks}
          teams={teams}
          currentStudentID={session.user.id ?? ''}
          updateTaskProgress={handleUpdateTaskProgress}
        />
      </div>
    </div>
  )
}

export default StudentTasksPage
