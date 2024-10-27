import type { Task } from '@/lib/backend/types/task'
import type React from 'react'
import TaskRow from './TaskRow'

interface TaskTableProps {
  tasks: Task[]
  handleDeleteTask: (taskId: number) => Promise<void>
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, handleDeleteTask }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                順番
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                タイトル
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                ジャンル
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                本文
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {tasks
              .sort((a, b) => {
                if (a.GenreDisplayOrder !== b.GenreDisplayOrder) {
                  return a.GenreDisplayOrder - b.GenreDisplayOrder
                }
                return a.DisplayOrder - b.DisplayOrder
              })
              .map((task) => (
                <TaskRow
                  key={task.ID}
                  task={task}
                  onDelete={handleDeleteTask}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TaskTable
