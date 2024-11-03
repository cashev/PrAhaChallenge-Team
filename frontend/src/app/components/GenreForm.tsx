'use client'

import type { Genre } from '@/lib/backend/types/genre'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect, useState } from 'react'

interface GenreFormProps {
  initialGenre?: Genre
  onSubmit: (name: string) => Promise<void>
}

const GenreForm: React.FC<GenreFormProps> = ({ initialGenre, onSubmit }) => {
  const router = useRouter()
  const [genreName, setGenreName] = useState(initialGenre?.Name || '')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialGenre) {
      setGenreName(initialGenre.Name)
    }
  }, [initialGenre])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!genreName.trim()) {
      setError('ジャンル名を入力してください')
      return
    }

    try {
      await onSubmit(genreName)
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
      <div className="space-y-4">
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          {initialGenre ? '更新' : '追加'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/genres')}
          className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          戻る
        </button>
      </div>
    </form>
  )
}

export default GenreForm
