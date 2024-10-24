import Link from 'next/link'
import type React from 'react'

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          管理者ダッシュボード
        </h1>
        <div className="overflow-hidden bg-white shadow sm:rounded-lg dark:bg-gray-800">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white">
              管理メニュー
            </h2>
            <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-4">
                <Link
                  href="/admin/tasks"
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  課題一覧
                </Link>
              </li>
              <li className="py-4">
                <Link
                  href="/admin/genres"
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  ジャンル一覧
                </Link>
              </li>
              {/* 他の管理メニュー項目をここに追加 */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
