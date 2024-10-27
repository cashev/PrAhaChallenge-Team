'use client'

import type { Genre } from '@/lib/backend/types/genre'
import type { Task } from '@/lib/backend/types/task'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect, useState } from 'react'

interface TaskFormProps {
  genres: Genre[]
  initialTask?: Task
  onSubmit: (
    title: string,
    text: string,
    genreId: number,
    displayOrder: number,
  ) => Promise<void>
}

export default function TaskForm({
  genres,
  initialTask,
  onSubmit,
}: TaskFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTask?.Title || '')
  const [text, setText] = useState(initialTask?.Text || '')
  const [genreId, setGenreId] = useState(initialTask?.GenreID || 0)
  const [displayOrder, setDisplayOrder] = useState(
    initialTask?.DisplayOrder || 0,
  )

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.Title)
      setText(initialTask.Text)
      setGenreId(initialTask.GenreID)
      setDisplayOrder(initialTask.DisplayOrder)
    }
  }, [initialTask])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const genre = genres.find((g) => g.ID === genreId)
    if (!title || !text || !genre) {
      alert('全ての項目を入力してください')
      return
    }
    try {
      await onSubmit(title, text, genre.ID, displayOrder)
      router.push('/admin/tasks')
    } catch (error) {
      console.error('課題の保存中にエラーが発生しました:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          タイトル
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="genre"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          ジャンル
        </label>
        <select
          id="genre"
          name="genre"
          required
          className="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 pl-3 pr-10 text-base text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          value={genreId}
          onChange={(e) => setGenreId(parseInt(e.target.value))}
        >
          <option value="">選択してください</option>
          {genres.map((genre) => (
            <option key={genre.ID} value={genre.ID}>
              {genre.Name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="text"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          本文
        </label>
        <textarea
          id="text"
          name="text"
          rows={3}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
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
      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          {initialTask ? '更新' : '作成'}
        </button>
      </div>
    </form>
  )
}
