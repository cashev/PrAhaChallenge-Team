import React from 'react';
import TaskForm from '@/app/components/TaskForm';
import { createTask } from '@/lib/backend/task';
import { getGenres } from '@/lib/backend/genre';
import { revalidatePath } from 'next/cache';

const NewTaskPage: React.FC = async () => { 
  const genres = await getGenres();

  async function handleCreateTask(title: string, text: string, genreId: number, displayOrder: number) {
    'use server';
    await createTask(title, text, genreId, displayOrder);
    revalidatePath('/admin/tasks');
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">新規課題作成</h1>
          <TaskForm genres={genres} onSubmit={handleCreateTask} />
        </div>
      </div>
    </div>
  );
}

export default NewTaskPage;
