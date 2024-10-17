'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface NewGenreFormProps {
  handleCreateGenre: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

const NewGenreForm: React.FC<NewGenreFormProps> = ({ handleCreateGenre }) => {
  const [genreName, setGenreName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await handleCreateGenre(formData);
      if (result.success) {
        router.push('/admin/tasks');
      } else {
        setError(result.error || 'ジャンルの作成に失敗しました。もう一度お試しください。');
      }
    } catch (err) {
      setError('ジャンルの作成に失敗しました。もう一度お試しください。');
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
        ジャンルを追加
      </button>
    </form>
  );
};

export default NewGenreForm;
