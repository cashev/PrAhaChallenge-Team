'use client'

import type { TaskAndProgress, TeamAndStudent } from '@/lib/backend/types/task'
import type React from 'react'

const statusColors = {
  未着手: 'text-gray-500 bg-gray-100 dark:text-gray-300 dark:bg-gray-700',
  着手中: 'text-blue-500 bg-blue-100 dark:text-blue-300 dark:bg-blue-700',
  レビュー待ち:
    'text-yellow-500 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-700',
  完了: 'text-green-500 bg-green-100 dark:text-green-300 dark:bg-green-700',
} as const

interface TaskProgressTableProps {
  tasks: TaskAndProgress[]
  teams: TeamAndStudent[]
  currentStudentID: string | undefined
  updateTaskProgress: (
    taskID: number,
    studentID: number,
    status: string,
  ) => Promise<void>
}

const TaskProgressTable: React.FC<TaskProgressTableProps> = ({
  tasks,
  teams,
  currentStudentID,
  updateTaskProgress,
}) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border dark:divide-gray-700">
        <thead>
          <tr>
            <th
              rowSpan={2}
              className="min-w-[200px] border-y border-l bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-700 dark:text-gray-300"
            >
              課題
            </th>
            <th
              rowSpan={2}
              className="min-w-[150px] border bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-700 dark:text-gray-300"
            >
              ジャンル
            </th>
            {teams.map((team) => (
              <th
                key={team.ID}
                colSpan={team.Students.length}
                className="border bg-gray-50 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-700 dark:text-gray-300"
              >
                {team.Name}
              </th>
            ))}
          </tr>
          <tr>
            {teams.map((team) =>
              team.Students.map((student) => (
                <th
                  key={student.ID}
                  className="whitespace-nowrap border bg-gray-50 px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                >
                  {student.Name}
                </th>
              )),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {tasks.map((task) => (
            <tr key={task.ID}>
              <td className="min-w-[200px] whitespace-nowrap border-y border-l bg-white px-6 py-4 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                {task.Text ? (
                  <a
                    href={task.Text}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {task.Title}
                  </a>
                ) : (
                  task.Title
                )}
              </td>
              <td className="min-w-[150px] whitespace-nowrap border bg-white px-6 py-4 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {task.GenreName}
              </td>
              {teams.map((team) =>
                team.Students.map((student) => {
                  const progress = task.Progress.find(
                    (p) => p.StudentID === student.ID,
                  )
                  const status = progress?.Status || '未着手'
                  return (
                    <td
                      key={`${task.ID}-${student.ID}`}
                      className="whitespace-nowrap border px-6 py-4 text-center"
                    >
                      {student.ID.toString() === currentStudentID ? (
                        <select
                          value={status}
                          onChange={(e) =>
                            updateTaskProgress(
                              task.ID,
                              student.ID,
                              e.target.value,
                            )
                          }
                          className={`rounded-md p-1.5 text-xs ${statusColors[status as keyof typeof statusColors]}`}
                        >
                          <option
                            value="未着手"
                            style={{ backgroundColor: '#f3f4f6' }}
                          >
                            未着手
                          </option>
                          <option
                            value="着手中"
                            style={{ backgroundColor: '#bfdbfe' }}
                          >
                            着手中
                          </option>
                          <option
                            value="レビュー待ち"
                            style={{ backgroundColor: '#fef08a' }}
                          >
                            レビュー待ち
                          </option>
                          <option
                            value="完了"
                            style={{ backgroundColor: '#bbf7d0' }}
                          >
                            完了
                          </option>
                        </select>
                      ) : (
                        <div
                          className={`text-xs ${statusColors[status as keyof typeof statusColors]}`}
                        >
                          {status}
                        </div>
                      )}
                    </td>
                  )
                }),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TaskProgressTable
