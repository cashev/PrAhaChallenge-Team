'use client'

import type React from 'react'
import { useState } from 'react'

type ExistingStudent = {
  studentId: number
  firstName: string
  lastName: string
  teamName: string
}

interface Student {
  firstName: string
  lastName: string
  email: string
  teamName: string
}

interface Props {
  seasonNumber: number
  students: Student[]
  existingStudents: ExistingStudent[]
  onSubmit: (
    seasonNumber: number,
    existingAssignments: ExistingStudent[],
    assignments: Student[],
  ) => void
}

export default function TeamAssignment({
  seasonNumber,
  students,
  existingStudents,
  onSubmit,
}: Props) {
  const [existingAssignments, setExistingAssignments] =
    useState(existingStudents)
  const [assignments, setAssignments] = useState(students)
  const [error, setError] = useState<string | null>(null)

  const handleExistingStudentChange = (index: number, value: string) => {
    const newAssignments = [...existingAssignments]
    newAssignments[index] = {
      ...newAssignments[index],
      teamName: value,
    }
    setExistingAssignments(newAssignments)
  }

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
        [field]: field === 'teamName' ? value.toUpperCase() : value,
      }
    }
    setAssignments(newAssignments)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 既存の受講生と新規受講生を合わせたチーム所属人数を集計
    const teamCounts = [...assignments, ...existingStudents].reduce(
      (acc, curr) => {
        const teamName = curr.teamName
        acc[teamName] = (acc[teamName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // 1人チームがあるかチェック（新規受講生のチームのみ）
    const singleMemberTeams = Object.entries(teamCounts)
      .filter(([teamName]) =>
        // 新規受講生が所属しているチームのみをフィルタリング
        assignments.some((student) => student.teamName === teamName),
      )
      .filter(([, count]) => count === 1)
      .map(([teamName]) => teamName)

    if (singleMemberTeams.length > 0) {
      setError(
        `1人のみ所属しているチームがあります：${singleMemberTeams.join(', ')}`,
      )
      return
    }

    await onSubmit(seasonNumber, existingAssignments, assignments)
  }

  return (
    <div>
      {existingStudents.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-bold">{seasonNumber}期の受講生</h2>
          <div className="space-y-4">
            {existingAssignments.map((student, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 rounded-lg border p-4"
              >
                <div className="col-span-2">
                  <span className="block text-sm font-medium">
                    {student.lastName} {student.firstName}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    チーム名
                  </label>
                  <select
                    value={student.teamName}
                    onChange={(e) =>
                      handleExistingStudentChange(index, e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                  >
                    {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-4 text-xl font-bold">新規受講生</h2>
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
                <select
                  value={student.teamName}
                  onChange={(e) =>
                    handleChange(index, 'teamName', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="">チームを選択</option>
                  {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
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
    </div>
  )
}
