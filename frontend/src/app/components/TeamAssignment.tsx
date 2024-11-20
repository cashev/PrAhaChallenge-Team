'use client'

import type React from 'react'
import { useState } from 'react'

interface Student {
  firstName: string
  lastName: string
  teamName?: string
}

interface TeamAssignmentProps {
  students: Student[]
  onSubmit: (
    assignments: { firstName: string; lastName: string; teamName: string }[],
  ) => Promise<void>
}

export default function TeamAssignment({
  students,
  onSubmit,
}: TeamAssignmentProps) {
  const [assignments, setAssignments] = useState(
    students.map((student) => ({
      ...student,
      teamName: student.teamName || '',
    })),
  )
  const [error, setError] = useState<string | null>(null)

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
        `以下のチームは1人しか所属していません：${singleMemberTeams.join(', ')}`,
      )
      return
    }

    await onSubmit(assignments)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}
      {assignments.map((assignment, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-48">
            <span className="text-gray-700 dark:text-gray-300">
              {assignment.lastName} {assignment.firstName}
            </span>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={assignment.teamName}
              onChange={(e) => {
                const newAssignments = [...assignments]
                newAssignments[index].teamName = e.target.value
                setAssignments(newAssignments)
              }}
              placeholder="チーム名"
              className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
        </div>
      ))}
      <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
      >
        確認画面へ
      </button>
    </form>
  )
}
