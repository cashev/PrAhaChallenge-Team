import Link from 'next/link'
import type React from 'react'
import ToastProvider from '../components/ToastProvider'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <Link
                href="/admin"
                className="flex shrink-0 items-center text-gray-900 dark:text-white"
              >
                管理者ダッシュボード
              </Link>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin/students"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-gray-900 hover:border-gray-300 dark:text-gray-300 dark:hover:border-gray-700"
                >
                  受講生一覧
                </Link>
                <Link
                  href="/admin/tasks"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-gray-900 hover:border-gray-300 dark:text-gray-300 dark:hover:border-gray-700"
                >
                  課題一覧
                </Link>
                <Link
                  href="/admin/genres"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-gray-900 hover:border-gray-300 dark:text-gray-300 dark:hover:border-gray-700"
                >
                  ジャンル一覧
                </Link>
                <Link
                  href="/admin/progress"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-gray-900 hover:border-gray-300 dark:text-gray-300 dark:hover:border-gray-700"
                >
                  課題進捗一覧
                </Link>
                <Link
                  href="/admin/supports"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-gray-900 hover:border-gray-300 dark:text-gray-300 dark:hover:border-gray-700"
                >
                  問い合わせ一覧
                </Link>
                {/* 他のナビゲーション項目 */}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {/* ユーザーメニューなど */}
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <ToastProvider>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
        </ToastProvider>
      </main>
    </div>
  )
}
