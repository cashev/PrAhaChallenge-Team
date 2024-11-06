'use client'

import StudentTable from '@/app/components/StudentTable'
import { getStudents } from '@/lib/backend/student'
import type { StudentsResponse } from '@/lib/backend/types/student-type'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function StudentsPage() {
  const searchParams = useSearchParams()
  const [students, setStudents] = useState<StudentsResponse[]>([])

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())
    const fetchStudents = async () => {
      const fetchedStudents = await getStudents(params)
      setStudents(fetchedStudents)
    }
    fetchStudents()
  }, [searchParams])

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          受講生一覧
        </h1>
      </div>
      <StudentTable students={students} searchParams={searchParams} />
    </div>
  )
}
