'use client'

import type { Task } from '@/lib/backend/types/task'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type React from 'react'
import TaskRow from './TaskRow'

interface TaskTableProps {
  tasks: Task[]
  handleDeleteTask: (taskId: number) => Promise<void>
  onTasksReorder: (tasks: Task[]) => void
  isReordering: boolean
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  handleDeleteTask,
  onTasksReorder,
  isReordering,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex((item) => item.ID === active.id)
      const newIndex = tasks.findIndex((item) => item.ID === over?.id)
      const newTasks = arrayMove(tasks, oldIndex, newIndex)
      onTasksReorder(newTasks)
    }
  }

  const tableContent = isReordering ? (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((task) => task.ID)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <TaskRow
            key={task.ID}
            task={task}
            onDelete={handleDeleteTask}
            isReordering={isReordering}
          />
        ))}
      </SortableContext>
    </DndContext>
  ) : (
    tasks.map((task) => (
      <TaskRow
        key={task.ID}
        task={task}
        onDelete={handleDeleteTask}
        isReordering={isReordering}
      />
    ))
  )

  return (
    <div className="w-full max-w-4xl">
      <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              タイトル
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              ジャンル
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {tableContent}
        </tbody>
      </table>
    </div>
  )
}

export default TaskTable
