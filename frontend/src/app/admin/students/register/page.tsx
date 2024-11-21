import StudentNameInput from '@/app/components/StudentNameInput'
import { temporaryStore } from '@/util/temporary-store'
import { redirect } from 'next/navigation'

export default function RegisterStudentsPage() {
  async function handleSubmit(input: string) {
    'use server'
    const students = input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '')
      .map((line) => {
        const [nameInfo, email, teamName] = line.split('\t')
        const [firstName, lastName] = nameInfo.split(' ')
        return { firstName, lastName, email, teamName }
      })

    if (students.length === 0) {
      throw new Error('受講生の情報を入力してください')
    }

    // セッションストレージに一時保存
    const storeId = temporaryStore.setStudents(students)
    redirect(`/admin/students/register/team?id=${storeId}`)
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          次期受講生登録
        </h1>
        <StudentNameInput onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
