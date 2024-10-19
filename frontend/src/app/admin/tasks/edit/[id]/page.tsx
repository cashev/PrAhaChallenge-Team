import React from "react";
import { getTask, updateTask, fetchTaskGenres } from '@/lib/backend/tasks';
import TaskForm from '@/app/components/TaskForm';
import { TaskGenre } from "@/lib/backend/types/task-genre";
import { revalidatePath } from "next/cache";

export default async function EditTaskPage({ params }: { params: { id: string } }) {
  const task = await getTask(parseInt(params.id));
  const genres = await fetchTaskGenres();

  const handleUpdate = async (title: string, genre: TaskGenre, text: string) => {
    'use server';
    await updateTask({
      ID: task.ID,
      Title: title,
      TaskGenre: genre,
      Text: text,
    });
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
