'use client'

import type { GenreWithReference } from '@/lib/backend/types/genre'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import type React from 'react'

interface GenreRowProps {
  genre: GenreWithReference
  onDelete: (genreId: number) => Promise<void>
  isReordering: boolean
}

const GenreRow: React.FC<GenreRowProps> = ({
  genre,
  onDelete,
  isReordering,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: genre.ID })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isReordering ? (isDragging ? 'grabbing' : 'grab') : 'default',
  }

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (confirm('本当にこのジャンルを削除しますか？')) {
      await onDelete(genre.ID)
    }
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isReordering ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
    >
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
        {genre.Name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
        <div className="flex items-center">
          {isReordering ? (
            <div className="flex-1 text-center">
              <span className="text-gray-500">ドラッグして順序変更</span>
            </div>
          ) : (
            <>
              <div className="flex flex-1 justify-center">
                <Link
                  href={`/admin/genres/edit/${genre.ID}`}
                  className="rounded-md bg-indigo-100 px-4 py-2 text-indigo-600 transition-colors duration-200 hover:bg-indigo-200 hover:text-indigo-900 dark:bg-indigo-700 dark:text-white dark:hover:bg-indigo-600 dark:hover:text-indigo-200"
                >
                  編集
                </Link>
              </div>
              <div className="flex flex-1 justify-center">
                <div className="group relative">
                  <button
                    onClick={handleDelete}
                    disabled={genre.IsReferenced}
                    className={`rounded-md px-4 py-2 transition-colors duration-200 ${
                      genre.IsReferenced
                        ? 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                        : 'bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-900 dark:bg-red-700 dark:text-white dark:hover:bg-red-600 dark:hover:text-red-200'
                    }`}
                  >
                    削除
                  </button>
                  {genre.IsReferenced && (
                    <div className="absolute bottom-full right-0 z-10 mb-2 whitespace-nowrap rounded-md bg-gray-700 px-3 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-gray-200 dark:text-gray-800">
                      このジャンルは参照されているため削除できません
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

export default GenreRow
