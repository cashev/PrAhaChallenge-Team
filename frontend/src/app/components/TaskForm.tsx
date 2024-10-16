'use client';

import React, { useState } from 'react';
import { TaskGenre } from '@/lib/backend/types/task-genre';
import { useRouter } from 'next/navigation';

interface TaskFormProps {
  genres: TaskGenre[];
  createTask: (title: string, genre: TaskGenre, text: string) => Promise<void>;
}

export default function TaskForm({ genres, createTask  }: TaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [genreId, setGenreId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const genre = genres.find((g) => g.ID === parseInt(genreId));
    if (!title || !text || !genre) {
      alert('All fields are required');
      return;
    }
    await createTask(title, genre, text);
    router.push('/admin/tasks');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
          ジャンル
        </label>
        <select
          id="genre"
          name="genre"
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={genreId}
          onChange={(e) => setGenreId(e.target.value)}
        >
          <option value="">選択してください</option>
          {genres.map((genre) => (
            <option key={genre.ID} value={genre.ID}>
              {genre.GenreName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">
          本文
        </label>
        <textarea
          id="text"
          name="text"
          rows={3}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          作成
        </button>
      </div>
    </form>
  );
}