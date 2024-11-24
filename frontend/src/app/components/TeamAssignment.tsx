'use client'

import { useRouter } from 'next/navigation'
import type React from 'react'
import { useEffect, useState } from 'react'

type ExistingStudent = {
  studentId: number
  firstName: string
  lastName: string
  teamName: string
}

interface NewStudent {
  firstName: string
  lastName: string
  email: string
  teamName: string
}

interface Props {
  seasonNumber: number
  existingStudents: ExistingStudent[]
}

const convertToNewStudent = (studentInfos: string | null): NewStudent[] => {
  if (!studentInfos) {
    return []
  }
  return studentInfos
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line) => {
      const [nameInfo, email, teamName] = line.split('\t')
      const [firstName, lastName] = nameInfo.split(' ')
      return { firstName, lastName, email, teamName: teamName.toUpperCase() }
    })
}

export default function TeamAssignment({
  seasonNumber,
  existingStudents,
}: Props) {
  const [assignmentsForExisting, setAssignmentsForExisting] =
    useState(existingStudents)
  const [assignmentsForNew, setAssignmentsForNew] = useState<NewStudent[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const studentInfos = localStorage.getItem('register_studentInfos')
    const newStudents = convertToNewStudent(studentInfos)
    if (newStudents.length === 0) {
      router.push('/admin/students/register')
      return
    }
    setAssignmentsForNew(newStudents)

    const previousAssignmentsForExisting = localStorage.getItem(
      'register_assignmentsForExisting',
    )
    const previousAssignmentsForNew = localStorage.getItem(
      'register_assignmentsForNew',
    )
    if (previousAssignmentsForExisting && previousAssignmentsForNew) {
      setAssignmentsForExisting(JSON.parse(previousAssignmentsForExisting))
      setAssignmentsForNew(JSON.parse(previousAssignmentsForNew))
    } else {
      setAssignmentsForExisting(existingStudents)
    }
  }, [router, existingStudents])

  const handleChangeAssignmentForExisting = (index: number, value: string) => {
    const newAssignments = [...assignmentsForExisting]
    newAssignments[index] = {
      ...newAssignments[index],
      teamName: value,
    }
    setAssignmentsForExisting(newAssignments)
  }

  const handleChangeAssignmentForNew = (
    index: number,
    field: 'name' | 'email' | 'teamName',
    value: string,
  ) => {
    const newAssignments = [...assignmentsForNew]
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
    setAssignmentsForNew(newAssignments)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 既存の受講生と新規受講生を合わせたチーム所属人数を集計
    const teamCounts = [...assignmentsForNew, ...assignmentsForExisting].reduce(
      (acc, curr) => {
        const teamName = curr.teamName
        acc[teamName] = (acc[teamName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // 1人チームがあるかチェック（新規受講生のチームのみ）
    const singleMemberTeams = Object.entries(teamCounts)
      .filter(
        ([teamName]) =>
          // 新規受講生または既存受講生が所属しているチームのみをフィルタリング
          assignmentsForNew.some((student) => student.teamName === teamName) ||
          assignmentsForExisting.some(
            (student) => student.teamName === teamName,
          ),
      )
      .filter(([, count]) => count === 1)
      .map(([teamName]) => teamName)

    if (singleMemberTeams.length > 0) {
      setError(
        `1人のみ所属しているチームがあります：${singleMemberTeams.join(', ')}`,
      )
      return
    }

    localStorage.setItem(
      'register_existingStudents',
      JSON.stringify(existingStudents),
    )
    localStorage.setItem(
      'register_assignmentsForExisting',
      JSON.stringify(assignmentsForExisting),
    )
    localStorage.setItem(
      'register_assignmentsForNew',
      JSON.stringify(assignmentsForNew),
    )

    router.push(`/admin/students/register/confirm?season=${seasonNumber}`)
  }

  return (
    <div>
      {assignmentsForExisting.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-bold">{seasonNumber}期の受講生</h2>
          <div className="space-y-4">
            {assignmentsForExisting.map((student, index) => (
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
                      handleChangeAssignmentForExisting(index, e.target.value)
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
          {assignmentsForNew.map((student, index) => (
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
                  onChange={(e) =>
                    handleChangeAssignmentForNew(index, 'name', e.target.value)
                  }
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
                  onChange={(e) =>
                    handleChangeAssignmentForNew(index, 'email', e.target.value)
                  }
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
                    handleChangeAssignmentForNew(
                      index,
                      'teamName',
                      e.target.value,
                    )
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
              type="button"
              onClick={() => router.push(`/admin/students/register`)}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              戻る
            </button>
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
