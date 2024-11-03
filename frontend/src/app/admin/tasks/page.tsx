import TaskEditor from '@/app/components/TaskEditor'
import { deleteTask, getTasks, updateTaskOrders } from '@/lib/backend/task'
import type { TaskOrder } from '@/lib/backend/types/task'
import { revalidatePath } from 'next/cache'
import type React from 'react'

const handleDeleteTask = async (taskId: number) => {
  'use server'
  await deleteTask(taskId)
  revalidatePath('/admin/tasks', 'page')
}

const handleUpdateTaskOrders = async (taskOrders: TaskOrder[]) => {
  'use server'
  await updateTaskOrders(taskOrders)
  revalidatePath('/admin/tasks', 'page')
}

const TasksPage: React.FC = async () => {
  const tasks = await getTasks()
  const sortedTasks = tasks.sort((a, b) => {
    if (a.GenreDisplayOrder !== b.GenreDisplayOrder) {
      return a.GenreDisplayOrder - b.GenreDisplayOrder
    }
    return a.DisplayOrder - b.DisplayOrder
  })

  return (
    <div className="mx-auto max-w-4xl py-8">
      <TaskEditor
        tasks={sortedTasks}
        handleDeleteTask={handleDeleteTask}
        handleUpdateTaskOrders={handleUpdateTaskOrders}
      />
    </div>
  )
}

export default TasksPage
