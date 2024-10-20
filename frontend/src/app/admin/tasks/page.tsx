import TaskTable from '@/app/components/TaskTable'
import { getTasks } from '@/lib/backend/task'
import Link from 'next/link'
import React from 'react'

const TasksPage: React.FC = async () => {
  const tasks = await getTasks()

  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          課題一覧
        </h1>
        <Link
          href="/admin/tasks/new"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          新規課題作成
        </Link>
      </div>
      <TaskTable tasks={tasks} />
    </div>
  )
}

export default TasksPage
