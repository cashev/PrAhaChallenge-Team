'use client'

import type React from 'react'
import { useState } from 'react'

interface StudentNameInputProps {
  onSubmit: (input: string) => Promise<void>
}

export default function StudentNameInput({ onSubmit }: StudentNameInputProps) {
  const [names, setNames] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit(names)
    } catch (error) {
      setError(error instanceof Error ? error.message : '登録に失敗しました')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="names"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          受講生情報（FirstName
          LastNameとメールアドレスとチーム名をタブ区切りで1行に1名）
        </label>
        <textarea
          id="names"
          rows={10}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          value={names}
          onChange={(e) => setNames(e.target.value)}
          placeholder={`Taro Yamada\ttaro.yamada@example.com\tA
Hanako Sato\thanako.sato@example.com\tB`}
        />
      </div>
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        次へ
      </button>
    </form>
  )
}
