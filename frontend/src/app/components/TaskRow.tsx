'use client'

import type { Task } from '@/lib/backend/types/task'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import type React from 'react'

interface TaskRowProps {
  task: Task
  onDelete: (taskId: number) => Promise<void>
  isReordering: boolean
}

const TaskRow: React.FC<TaskRowProps> = ({ task, onDelete, isReordering }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.ID })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isReordering ? (isDragging ? 'grabbing' : 'grab') : 'default',
  }

  const handleOnDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (confirm('本当にこの課題を削除しますか？')) {
      await onDelete(task.ID)
    }
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isReordering ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
    >
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
        {task.Title}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {task.GenreName}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {task.Text}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <div className="flex items-center">
          {isReordering ? (
            <div className="flex-1 text-center">
              <span className="text-gray-500">ドラッグして順番変更</span>
            </div>
          ) : (
            <>
              <div className="flex flex-1 justify-center">
                <Link
                  href={`/admin/tasks/edit/${task.ID}`}
                  className="rounded-md bg-indigo-100 px-4 py-2 text-indigo-600 transition-colors duration-200 hover:bg-indigo-200 hover:text-indigo-900 dark:bg-indigo-700 dark:text-white dark:hover:bg-indigo-600 dark:hover:text-indigo-200"
                >
                  編集
                </Link>
              </div>
              <div className="flex flex-1 justify-center">
                <button
                  onClick={handleOnDelete}
                  className="rounded-md bg-red-100 px-4 py-2 text-red-600 transition-colors duration-200 hover:bg-red-200 hover:text-red-900 dark:bg-red-700 dark:text-white dark:hover:bg-red-600 dark:hover:text-red-200"
                >
                  削除
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export default TaskRow
