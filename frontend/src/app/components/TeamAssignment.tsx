'use client'

import type React from 'react'
import { useState } from 'react'

interface TeamAssignmentProps {
  students: {
    firstName: string
    lastName: string
    email: string
    teamName: string
  }[]
  onSubmit: (
    assignments: {
      firstName: string
      lastName: string
      email: string
      teamName: string
    }[],
  ) => Promise<void>
}

export default function TeamAssignment({
  students,
  onSubmit,
}: TeamAssignmentProps) {
  const [assignments, setAssignments] = useState(students)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    index: number,
    field: 'name' | 'email' | 'teamName',
    value: string,
  ) => {
    const newAssignments = [...assignments]
    if (field === 'name') {
      const [firstName, lastName] = value.split(' ')
      newAssignments[index] = {
        ...newAssignments[index],
        firstName: firstName || '',
        lastName: lastName || '',
      }
    } else {
      newAssignments[index] = {
        ...newAssignments[index],
        [field]: value,
      }
    }
    setAssignments(newAssignments)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // チームごとの所属人数を集計
    const teamCounts = assignments.reduce(
      (acc, curr) => {
        const teamName = curr.teamName
        acc[teamName] = (acc[teamName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // 1人チームがあるかチェック
    const singleMemberTeams = Object.entries(teamCounts)
      .filter(([, count]) => count === 1)
      .map(([teamName]) => teamName)

    if (singleMemberTeams.length > 0) {
      setError(
        `1人のみ所属しているチームがあります：${singleMemberTeams.join(', ')}`,
      )
      return
    }

    await onSubmit(assignments)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {assignments.map((student, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-4 rounded-lg border p-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                名前
              </label>
              <input
                type="text"
                value={`${student.firstName} ${student.lastName}`}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                placeholder="山田 太郎"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                メールアドレス
              </label>
              <input
                type="email"
                value={student.email}
                onChange={(e) => handleChange(index, 'email', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                チーム名
              </label>
              <input
                type="text"
                value={student.teamName}
                onChange={(e) =>
                  handleChange(index, 'teamName', e.target.value)
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-end space-x-4">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            確認画面へ
          </button>
        </div>
      </div>
    </form>
  )
}
