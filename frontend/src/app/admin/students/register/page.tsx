import StudentNameInput from '@/app/components/StudentNameInput'
import { temporaryStore } from '@/util/temporary-store'
import { redirect } from 'next/navigation'

export default function RegisterStudentsPage() {
  async function handleSubmit(names: string) {
    'use server'
    const students = names
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '')
      .map((line) => {
        const [firstName, lastName] = line.split(' ')
        return { firstName, lastName }
      })

    if (students.length === 0) {
      throw new Error('受講生の名前を入力してください')
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
