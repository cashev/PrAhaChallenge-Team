import TaskForm from '@/app/components/TaskForm'
import { getGenres } from '@/lib/backend/genre'
import { createTask } from '@/lib/backend/task'
import { revalidatePath } from 'next/cache'
import type React from 'react'

const NewTaskPage: React.FC = async () => {
  const genres = await getGenres()

  async function handleCreateTask(
    title: string,
    text: string,
    genreId: number,
    displayOrder: number,
  ) {
    'use server'
    await createTask(title, text, genreId, displayOrder)
    revalidatePath('/admin/tasks')
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            新規課題作成
          </h1>
          <TaskForm genres={genres} onSubmit={handleCreateTask} />
        </div>
      </div>
    </div>
  )
}

export default NewTaskPage
