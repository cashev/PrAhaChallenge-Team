"use client";

import React from "react";
import { Task } from "@/lib/backend/types/task";
import Link from "next/link";

interface TaskRowProps {
  task: Task;
  onDelete: (taskId: number) => Promise<void>;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, onDelete }) => {
  const handleOnDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (confirm("本当にこのタスクを削除しますか？")) {
      await onDelete(task.ID);
    }
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{task.Title}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{task.TaskGenre.GenreName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{task.Text}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center">
          <div className="flex-1 flex justify-center">
            <Link 
              href={`/admin/tasks/edit/${task.ID}`} 
              className="text-indigo-600 hover:text-indigo-900 dark:text-white dark:hover:text-indigo-200 px-4 py-2 rounded-md bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200"
            >
              編集
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <button
              onClick={handleOnDelete}
              className="text-red-600 hover:text-red-900 dark:text-white dark:hover:text-red-200 px-4 py-2 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
            >
              削除
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default TaskRow;
