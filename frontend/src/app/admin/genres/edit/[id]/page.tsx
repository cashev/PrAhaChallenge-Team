import GenreForm from '@/app/components/GenreForm'
import { getGenre, updateGenre } from '@/lib/backend/genre'
import { revalidatePath } from 'next/cache'

export default async function EditGenrePage({
  params,
}: {
  params: { id: string }
}) {
  const genre = await getGenre(parseInt(params.id))

  const handleUpdate = async (name: string) => {
    'use server'
    await updateGenre(genre.ID, name)
    revalidatePath('/admin/genres', 'page')
    revalidatePath('/admin/genres/publications', 'page')
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
