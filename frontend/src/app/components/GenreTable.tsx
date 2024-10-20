import React from "react";
import { GenreWithReference } from "@/lib/backend/types/genre";
import GenreRow from "@/app/components/GenreRow";
import { revalidatePath } from "next/cache";
import { deleteGenre } from "@/lib/backend/genre";

interface GenreTableProps {
  genres: GenreWithReference[];
}

const handleDeleteGenre = async (genreId: number) => {
  'use server';
  await deleteGenre(genreId);
  revalidatePath('/admin/genres');
};

const GenreTable: React.FC<GenreTableProps> = ({ genres }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">順番</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ジャンル名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {genres
              .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
              .map((genre) => (
                <GenreRow key={genre.ID} genre={genre} onDelete={handleDeleteGenre} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GenreTable;
