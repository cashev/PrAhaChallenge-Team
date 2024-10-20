import React from "react";
import { getTask, updateTask } from '@/lib/backend/task';
import { getGenres } from '@/lib/backend/genre';
import TaskForm from '@/app/components/TaskForm';
import { revalidatePath } from "next/cache";

export default async function EditTaskPage({ params }: { params: { id: string } }) {
  const task = await getTask(parseInt(params.id));
  const genres = await getGenres();

  const handleUpdate = async (title: string, text: string, genreId: number, displayOrder: number) => {
    'use server';
    await updateTask(
      task.ID,
      title,
      text,
      genreId,
      displayOrder
    );
    revalidatePath('/admin/tasks');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">課題の編集</h1>
      <TaskForm
        genres={genres}
        initialTask={task}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
