import Link from 'next/link'
import type React from 'react'

const HomePage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          課題管理システム
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          管理者または受講生としてログインしてください
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <Link
                href="/admin"
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                管理者ページへ
              </Link>
            </div>
            <div>
              <Link
                href="/student"
                className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                受講生ページへ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
