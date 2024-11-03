import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import TaskProgressTable from '@/app/components/TaskProgressTable'
import { getTasksByStudent } from '@/lib/backend/task'
import { getServerSession } from 'next-auth'
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

const updateTaskProgress = async (
  token: string,
  taskID: number,
  studentID: number,
  status: string,
) => {
  'use server'
  console.log(token, taskID, studentID, status)
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
          updateTaskProgress={updateTaskProgress}
          accessToken={session.accessToken}
        />
      </div>
    </div>
  )
}

export default StudentTasksPage
