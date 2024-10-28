'use client'

import type { GenreOrder, GenreWithReference } from '@/lib/backend/types/genre'
import Link from 'next/link'
import type React from 'react'
import { useEffect, useState } from 'react'
import GenreTable from './GenreTable'

interface GenreEditorProps {
  genres: GenreWithReference[]
  handleDeleteGenre: (genreId: number) => Promise<void>
  handleUpdateGenreOrders: (genreOrders: GenreOrder[]) => Promise<void>
}

const GenreEditor: React.FC<GenreEditorProps> = ({
  genres: initialGenres,
  handleDeleteGenre,
  handleUpdateGenreOrders,
}) => {
  const [isReordering, setIsReordering] = useState(false)
  const [genres, setGenres] = useState(initialGenres)

  useEffect(() => {
    setGenres(initialGenres)
  }, [initialGenres])

  const saveNewOrder = async () => {
    const genreOrders: GenreOrder[] = genres.map((genre, index) => ({
      GenreID: genre.ID,
      NewOrder: index + 1,
    }))

    await handleUpdateGenreOrders(genreOrders)
    setIsReordering(false)
  }

  const handleGenresReorder = (reorderedGenres: GenreWithReference[]) => {
    setGenres(reorderedGenres)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ジャンル一覧
        </h1>
        <div className="flex gap-4">
          {isReordering ? (
            <>
              <button
                onClick={saveNewOrder}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setIsReordering(false)
                  setGenres(initialGenres) // 元の順序に戻す
                }}
                className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                キャンセル
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsReordering(true)}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                順番変更
              </button>
              <Link
                href="/admin/genres/publications"
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
              >
                公開設定
              </Link>
              <Link
                href="/admin/genres/new"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                新規ジャンル作成
              </Link>
            </>
          )}
        </div>
      </div>
      <GenreTable
        genres={genres}
        handleDeleteGenre={handleDeleteGenre}
        onGenresReorder={handleGenresReorder}
        isReordering={isReordering}
      />
    </div>
  )
}

export default GenreEditor
