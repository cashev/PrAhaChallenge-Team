"use client";

import React from "react";
import { TaskGenre } from "@/lib/backend/types/task-genre";
import Link from "next/link";

interface GenreRowProps {
  genre: TaskGenre;
  onDelete: (genreId: number) => Promise<void>;
}

const GenreRow: React.FC<GenreRowProps> = ({ genre, onDelete }) => {
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (confirm("本当にこのジャンルを削除しますか？")) {
      await onDelete(genre.ID);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{genre.GenreName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center">
          <div className="flex-1 flex justify-center">
            <Link 
              href={`/admin/genres/edit/${genre.ID}`} 
              className="text-indigo-600 hover:text-indigo-900 px-4 py-2 rounded-md bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200"
            >
              編集
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-900 px-4 py-2 rounded-md bg-red-100 hover:bg-red-200 transition-colors duration-200"
            >
              削除
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default GenreRow;
