import GenreForm from '@/app/components/GenreForm'
import { getGenre, updateGenre } from '@/lib/backend/genre'
import { revalidatePath } from 'next/cache'

export default async function EditGenrePage({
  params,
}: {
  params: { id: string }
}) {
  const genre = await getGenre(parseInt(params.id))

  const handleUpdate = async (name: string, displayOrder: number) => {
    'use server'
    await updateGenre(genre.ID, name, displayOrder)
    revalidatePath('/admin/genres')
    revalidatePath('/admin/tasks')
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        ジャンルの編集
      </h1>
      <GenreForm initialGenre={genre} onSubmit={handleUpdate} />
    </div>
  )
}
