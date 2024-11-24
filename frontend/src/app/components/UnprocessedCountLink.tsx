'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const UnprocessedCountLink = () => {
  const [unprocessedCount, setUnprocessedCount] = useState<number | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const fetchUnprocessedCount = async () => {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/status-change-requests/unprocessed-count`,
        )
        const data = await response.json()
        setUnprocessedCount(data.count)
      } catch (error) {
        console.error('Failed to fetch unprocessed count:', error)
        setUnprocessedCount(0)
      }
    }

    fetchUnprocessedCount()
  }, [pathname])

  return (
    <Link
      href="/admin/supports"
      className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-gray-900 hover:border-gray-300 dark:text-gray-300 dark:hover:border-gray-700"
    >
      問い合わせ一覧
      <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
        {unprocessedCount}
      </span>
    </Link>
  )
}

export default UnprocessedCountLink
