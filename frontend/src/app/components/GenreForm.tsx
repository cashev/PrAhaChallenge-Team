'use client'

import type { Genre } from '@/lib/backend/types/genre'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect, useState } from 'react'

interface GenreFormProps {
  initialGenre?: Genre
  onSubmit: (name: string, displayOrder: number) => Promise<void>
}

const GenreForm: React.FC<GenreFormProps> = ({ initialGenre, onSubmit }) => {
  const router = useRouter()
  const [genreName, setGenreName] = useState(initialGenre?.Name || '')
  const [displayOrder, setDisplayOrder] = useState(
    initialGenre?.DisplayOrder || 0,
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialGenre) {
      setGenreName(initialGenre.Name)
      setDisplayOrder(initialGenre.DisplayOrder)
    }
  }, [initialGenre])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!genreName.trim()) {
      setError('ジャンル名を入力してください')
      return
    }
    if (isNaN(displayOrder) || displayOrder < 0) {
      setError('表示順は0以上の整数で入力してください')
      return
    }

    try {
      await onSubmit(genreName, displayOrder)
      router.push('/admin/genres')
    } catch (error) {
      console.error('ジャンルの保存中にエラーが発生しました:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div>
        <label
          htmlFor="genreName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          ジャンル名
        </label>
        <input
          type="text"
          id="genreName"
          name="genreName"
          value={genreName}
          onChange={(e) => setGenreName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <div>
        <label
          htmlFor="displayOrder"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          表示順
        </label>
        <input
          type="number"
          id="displayOrder"
          name="displayOrder"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <button
        type="submit"
        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-600"
      >
        {initialGenre ? '更新' : '追加'}
      </button>
    </form>
  )
}

export default GenreForm
