"use client";

import React from "react";
import { TaskGenreWithReference } from "@/lib/backend/types/task-genre";
import Link from "next/link";

interface GenreRowProps {
  genre: TaskGenreWithReference;
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
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 relative">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{genre.GenreName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center">
          <div className="flex-1 flex justify-center">
            <Link 
              href={`/admin/genres/edit/${genre.ID}`} 
              className="text-indigo-600 hover:text-indigo-900 dark:text-white dark:hover:text-indigo-200 px-4 py-2 rounded-md bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200"
            >
              編集
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative group">
              <button
                onClick={handleDelete}
                disabled={genre.IsReferenced}
                className={`text-red-600 hover:text-red-900 dark:text-white dark:hover:text-red-200 px-4 py-2 rounded-md ${
                  genre.IsReferenced
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-100 hover:bg-red-200 dark:bg-red-700 dark:hover:bg-red-600"
                } transition-colors duration-200`}
              >
                削除
              </button>
              {genre.IsReferenced && (
                <div className="absolute z-10 bottom-full right-0 mb-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  このジャンルは課題で使用されているため削除できません
                </div>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default GenreRow;
