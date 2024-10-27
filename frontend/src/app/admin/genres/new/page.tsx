import GenreForm from '@/app/components/GenreForm'
import { createGenre } from '@/lib/backend/genre'
import { revalidatePath } from 'next/cache'
import type React from 'react'

const NewGenrePage: React.FC = () => {
  async function handleCreateGenre(name: string, displayOrder: number) {
    'use server'
    await createGenre(name, displayOrder)
    revalidatePath('/admin/genres')
    revalidatePath('/admin/genres/publications')
  }

  return (
    <div className="mx-auto mt-10 max-w-md">
      <h1 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">
        新規ジャンル追加
      </h1>
      <GenreForm onSubmit={handleCreateGenre} />
    </div>
  )
}

export default NewGenrePage
