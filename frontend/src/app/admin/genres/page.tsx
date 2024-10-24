import GenreTable from '@/app/components/GenreTable'
import { getGenres } from '@/lib/backend/genre'
import Link from 'next/link'

export default async function GenresPage() {
  const genres = await getGenres()

  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ジャンル一覧
        </h1>
        <div className="space-x-2">
          <Link
            href="/admin/genres/publications"
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          >
            公開設定
          </Link>
          <Link
            href="/admin/genres/new"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            新規ジャンル作成
          </Link>
        </div>
      </div>
      <GenreTable genres={genres} />
    </div>
  )
}
