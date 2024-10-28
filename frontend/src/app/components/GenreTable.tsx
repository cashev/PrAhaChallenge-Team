'use client'

import GenreRow from '@/app/components/GenreRow'
import type { GenreWithReference } from '@/lib/backend/types/genre'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type React from 'react'

interface GenreTableProps {
  genres: GenreWithReference[]
  handleDeleteGenre: (genreId: number) => Promise<void>
  onGenresReorder: (genres: GenreWithReference[]) => void
  isReordering: boolean
}

const GenreTable: React.FC<GenreTableProps> = ({
  genres,
  handleDeleteGenre,
  onGenresReorder,
  isReordering,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = genres.findIndex((item) => item.ID === active.id)
      const newIndex = genres.findIndex((item) => item.ID === over?.id)
      const newGenres = arrayMove(genres, oldIndex, newIndex)
      onGenresReorder(newGenres)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  ジャンル名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              <SortableContext
                items={genres.map((genre) => genre.ID)}
                strategy={verticalListSortingStrategy}
              >
                {genres.map((genre) => (
                  <GenreRow
                    key={genre.ID}
                    genre={genre}
                    onDelete={handleDeleteGenre}
                    isReordering={isReordering}
                  />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
      </div>
    </div>
  )
}

export default GenreTable
