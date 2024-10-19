import React from "react";
import { getTaskGenre, updateTaskGenre } from '@/lib/backend/tasks';
import GenreForm from '@/app/components/GenreForm';
import { revalidatePath } from "next/cache";

export default async function EditGenrePage({ params }: { params: { id: string } }) {
  const genre = await getTaskGenre(parseInt(params.id));

  const handleUpdate = async (genreName: string) => {
    'use server';
    await updateTaskGenre({
      ID: genre.ID,
      GenreName: genreName,
    });
    revalidatePath('/admin/genres');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ジャンルの編集</h1>
      <GenreForm
        initialGenre={genre}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
