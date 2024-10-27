import GenrePublicationEditor from '@/app/components/GenrePublicationEditor'
import {
  getGenrePublications,
  updatePublicationStatus,
} from '@/lib/backend/genrePublication'
import type { UpdateGenrePublicationRequest } from '@/lib/backend/types/genrePublication'
import { revalidatePath } from 'next/cache'

const saveGenrePublications = async (data: UpdateGenrePublicationRequest[]) => {
  'use server'
  await updatePublicationStatus(data)
  revalidatePath('/admin', 'page')
}

const GenrePublicationPage = async () => {
  const data = await getGenrePublications()

  if (!data) return <div>読み込み中...</div>

  return (
    <div className="bg-gray-100 p-4 dark:bg-gray-900">
      <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
        ジャンル公開状況
      </h1>
      <GenrePublicationEditor
        initialData={data}
        saveGenrePublications={saveGenrePublications}
      />
    </div>
  )
}

export default GenrePublicationPage
