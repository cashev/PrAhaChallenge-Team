'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskGenre } from '@/lib/backend/types/task-genre';

interface GenreFormProps {
  initialGenre?: TaskGenre;
  onSubmit: (genreName: string) => Promise<void>;
}

const GenreForm: React.FC<GenreFormProps> = ({ initialGenre, onSubmit }) => {
  const router = useRouter();
  const [genreName, setGenreName] = useState(initialGenre?.GenreName || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialGenre) {
      setGenreName(initialGenre.GenreName);
    }
  }, [initialGenre]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!genreName.trim()) {
      setError('ジャンル名を入力してください');
      return;
    }

    try {
      await onSubmit(genreName);
      router.push('/admin/genres');
    } catch (error) {
      console.error('ジャンルの保存中にエラーが発生しました:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div>
        <label htmlFor="genreName" className="block text-sm font-medium text-gray-700">
          ジャンル名
        </label>
        <input
          type="text"
          id="genreName"
          name="genreName"
          value={genreName}
          onChange={(e) => setGenreName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {initialGenre ? '更新' : '追加'}
      </button>
    </form>
  );
};

export default GenreForm;
