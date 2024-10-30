import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getTasksByStudent } from '@/lib/backend/task'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import type React from 'react'

async function getTasks(token: string) {
  try {
    const tasks = await getTasksByStudent(token)
    const sortedTasks = tasks.sort((a, b) => {
      if (a.GenreDisplayOrder === b.GenreDisplayOrder) {
        return a.DisplayOrder - b.DisplayOrder
      }
      return a.GenreDisplayOrder - b.GenreDisplayOrder
    })
    return sortedTasks
  } catch (error) {
    console.error('課題の取得に失敗しました:', error)
    throw new Error('課題の取得に失敗しました')
  }
}

const StudentTasksPage: React.FC = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    redirect('/login')
  }

  const tasks = await getTasks(session.accessToken)

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg dark:bg-gray-800">
      <div className="px-4 py-5 sm:p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          課題一覧
        </h1>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.ID}
              className="rounded-lg border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {task.Title}
                  </h2>
                  <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    ジャンル: {task.GenreName}
                  </div>
                </div>
              </div>
              {task.Text && (
                <div className="prose mt-4 max-w-none text-gray-700 dark:text-gray-300">
                  {task.Text}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudentTasksPage
