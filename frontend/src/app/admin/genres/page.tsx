import React from 'react';
import { getGenres } from '@/lib/backend/genre';
import GenreTable from '@/app/components/GenreTable';
import Link from 'next/link';

export default async function GenresPage() {
  const genres = await getGenres();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ジャンル一覧
        </h1>
        <Link
          href="/admin/genres/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
          新規ジャンル作成
        </Link>
      </div>
      <GenreTable genres={genres} />
    </div>
  );
}
