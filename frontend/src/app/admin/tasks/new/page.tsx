import React from 'react';
import TaskForm from '@/app/components/TaskForm';
import { fetchTaskGenres, createTask } from '@/lib/backend/tasks';
import { TaskGenre } from '@/lib/backend/types/task-genre';
import { revalidatePath } from 'next/cache';


const NewTaskPage: React.FC = async () => { 
  const genres = await fetchTaskGenres();

  async function handleCreateTask(title: string, genre: TaskGenre, text: string) {
    'use server';
    await createTask(title, genre, text);
    revalidatePath('/admin/tasks');
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-lg leading-6 font-medium text-gray-900">新規課題作成</h1>
          <TaskForm genres={genres} onSubmit={handleCreateTask} />
        </div>
      </div>
    </div>
  );
  }

export default NewTaskPage;
