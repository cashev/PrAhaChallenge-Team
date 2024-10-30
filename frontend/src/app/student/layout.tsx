'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import type React from 'react'
import LogoutButton from '../components/LogoutButton'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white shadow-sm dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <Link
                href="/student"
                className="flex shrink-0 items-center text-gray-900 dark:text-white"
              >
                受講生ダッシュボード
              </Link>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/student/tasks"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-gray-900 hover:border-gray-300 dark:text-gray-300 dark:hover:border-gray-700"
                >
                  課題一覧
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {session?.user && <LogoutButton />}
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
