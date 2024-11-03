import GenreEditor from '@/app/components/GenreEditor'
import { deleteGenre, getGenres, updateGenreOrders } from '@/lib/backend/genre'
import type { GenreOrder } from '@/lib/backend/types/genre'
import { revalidatePath } from 'next/cache'
import type React from 'react'

const handleDeleteGenre = async (genreId: number) => {
  'use server'
  await deleteGenre(genreId)
  revalidatePath('/admin/genres')
  revalidatePath('/admin/genres/publications')
}

const handleUpdateGenreOrders = async (genreOrders: GenreOrder[]) => {
  'use server'
  await updateGenreOrders(genreOrders)
  revalidatePath('/admin/genres')
  revalidatePath('/admin/genres/publications')
  revalidatePath('/admin/tasks')
}

const GenresPage: React.FC = async () => {
  const genres = await getGenres()

  return (
    <div className="mx-auto max-w-4xl py-8">
      <GenreEditor
        genres={genres}
        handleDeleteGenre={handleDeleteGenre}
        handleUpdateGenreOrders={handleUpdateGenreOrders}
      />
    </div>
  )
}

export default GenresPage
