'use client'

import StudentTable from '@/app/components/StudentTable'
import { getStudents } from '@/lib/backend/student'
import type { StudentsResponse } from '@/lib/backend/types/student-type'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function StudentsPageContent() {
  const searchParams = useSearchParams()
  const [studentsData, setStudentsData] = useState<StudentsResponse>({
    students: [],
    totalCount: 0,
  })

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries())
    const fetchStudents = async () => {
      const response = await getStudents(params)
      setStudentsData(response)
    }
    fetchStudents()
  }, [searchParams])

  return (
    <div className="mx-auto max-w-7xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          受講生一覧
        </h1>
      </div>
      <StudentTable
        students={studentsData.students}
        totalCount={studentsData.totalCount}
        searchParams={searchParams}
      />
    </div>
  )
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentsPageContent />
    </Suspense>
  )
}
