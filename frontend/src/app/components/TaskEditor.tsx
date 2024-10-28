'use client'

import type { Task, TaskOrder } from '@/lib/backend/types/task'
import Link from 'next/link'
import type React from 'react'
import { useEffect, useState } from 'react'
import TaskTable from './TaskTable'

interface TaskEditorProps {
  tasks: Task[]
  handleDeleteTask: (taskId: number) => Promise<void>
  handleUpdateTaskOrders: (taskOrders: TaskOrder[]) => Promise<void>
}

const TaskEditor: React.FC<TaskEditorProps> = ({
  tasks: initialTasks,
  handleDeleteTask,
  handleUpdateTaskOrders,
}) => {
  const [isReordering, setIsReordering] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const saveNewOrder = async () => {
    const tasksByGenre = tasks.reduce(
      (acc, task) => {
        const genreId = task.GenreID
        if (!acc[genreId]) {
          acc[genreId] = []
        }
        acc[genreId].push(task)
        return acc
      },
      {} as Record<number, Task[]>,
    )

    const taskOrders: TaskOrder[] = Object.values(tasksByGenre).flatMap(
      (genreTasks) =>
        genreTasks.map((task, index) => ({
          TaskID: task.ID,
          NewOrder: index + 1,
        })),
    )

    await handleUpdateTaskOrders(taskOrders)
    setIsReordering(false)
  }

  const handleTasksReorder = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          課題一覧
        </h1>
        <div className="flex gap-4">
          {isReordering ? (
            <>
              <button
                onClick={saveNewOrder}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setIsReordering(false)
                  setTasks(initialTasks) // 元の順序に戻す
                }}
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                キャンセル
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsReordering(true)}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                順番変更
              </button>
              <Link
                href="/admin/tasks/new"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                新規課題作成
              </Link>
            </>
          )}
        </div>
      </div>
      <TaskTable
        tasks={tasks}
        handleDeleteTask={handleDeleteTask}
        onTasksReorder={handleTasksReorder}
        isReordering={isReordering}
      />
    </div>
  )
}

export default TaskEditor
