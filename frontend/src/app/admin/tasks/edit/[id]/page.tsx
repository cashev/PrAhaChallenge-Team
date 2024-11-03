import TaskForm from '@/app/components/TaskForm'
import { getGenres } from '@/lib/backend/genre'
import { getTask, updateTask } from '@/lib/backend/task'
import { revalidatePath } from 'next/cache'

export default async function EditTaskPage({
  params,
}: {
  params: { id: string }
}) {
  const task = await getTask(parseInt(params.id))
  const genres = await getGenres()

  const handleUpdate = async (title: string, text: string, genreId: number) => {
    'use server'
    await updateTask(task.ID, title, text, genreId)
    revalidatePath('/admin/tasks')
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        課題の編集
      </h1>
      <TaskForm genres={genres} initialTask={task} onSubmit={handleUpdate} />
    </div>
  )
}
