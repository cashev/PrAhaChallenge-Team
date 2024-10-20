'use client';

import React, { useState, useEffect } from 'react';
import { Genre } from '@/lib/backend/types/genre';
import { Task } from '@/lib/backend/types/task';
import { useRouter } from 'next/navigation';

interface TaskFormProps {
  genres: Genre[];
  initialTask?: Task;
  onSubmit: (title: string, text: string, genreId: number, displayOrder: number) => Promise<void>;
}

export default function TaskForm({ genres, initialTask, onSubmit }: TaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTask?.Title || '');
  const [text, setText] = useState(initialTask?.Text || '');
  const [genreId, setGenreId] = useState(initialTask?.GenreID || 0);
  const [displayOrder, setDisplayOrder] = useState(initialTask?.DisplayOrder || 0);

  console.log('initialTask: ', initialTask);
  console.log('genreId: ', genreId);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.Title);
      setText(initialTask.Text);
      setGenreId(initialTask.GenreID);
      setDisplayOrder(initialTask.DisplayOrder);
    }
  }, [initialTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const genre = genres.find((g) => g.ID === genreId);
    if (!title || !text || !genre) {
      alert('全ての項目を入力してください');
      return;
    }
    try {
      await onSubmit(title, text, genre.ID, displayOrder);
      router.push('/admin/tasks');
    } catch (error) {
      console.error('課題の保存中にエラーが発生しました:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          タイトル
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          ジャンル
        </label>
        <select
          id="genre"
          name="genre"
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={genreId}
          onChange={(e) => setGenreId(parseInt(e.target.value))}
        >
          <option value="">選択してください</option>
          {genres.map((genre) => (
            <option key={genre.ID} value={genre.ID}>
              {genre.Name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          本文
        </label>
        <textarea
          id="text"
          name="text"
          rows={3}
          required
          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          表示順
        </label>
        <input
          type="number"
          id="displayOrder"
          name="displayOrder"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
          required
          className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          {initialTask ? '更新' : '作成'}
        </button>
      </div>
    </form>
  );
}
