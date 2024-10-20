import GenreRow from '@/app/components/GenreRow'
import { deleteGenre } from '@/lib/backend/genre'
import type { GenreWithReference } from '@/lib/backend/types/genre'
import { revalidatePath } from 'next/cache'
import React from 'react'

interface GenreTableProps {
  genres: GenreWithReference[]
}

const handleDeleteGenre = async (genreId: number) => {
  'use server'
  await deleteGenre(genreId)
  revalidatePath('/admin/genres')
}

const GenreTable: React.FC<GenreTableProps> = ({ genres }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                順番
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                ジャンル名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {genres
              .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
              .map((genre) => (
                <GenreRow
                  key={genre.ID}
                  genre={genre}
                  onDelete={handleDeleteGenre}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GenreTable
