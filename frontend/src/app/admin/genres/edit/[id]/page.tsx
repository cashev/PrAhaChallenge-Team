import React from "react";
import { getGenre, updateGenre } from '@/lib/backend/genre';
import GenreForm from '@/app/components/GenreForm';
import { revalidatePath } from "next/cache";

export default async function EditGenrePage({ params }: { params: { id: string } }) {
  const genre = await getGenre(parseInt(params.id));

  const handleUpdate = async (name: string, displayOrder: number) => {
    'use server';
    await updateGenre(genre.ID, name, displayOrder);
    revalidatePath('/admin/genres');
    revalidatePath('/admin/tasks');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">ジャンルの編集</h1>
      <GenreForm
        initialGenre={genre}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
