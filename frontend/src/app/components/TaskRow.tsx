"use client";

import React from "react";
import { Task } from "@/lib/backend/types/task";
import Link from "next/link";
import { deleteTaskAction } from "@/app/actions/DeleteTaskAction";

interface TaskRowProps {
  task: Task;
}

const TaskRow: React.FC<TaskRowProps> = ({ task }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.Title}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.TaskGenre.GenreName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.Text}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {/* <Link href={`/admin/tasks/edit/${task.ID}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
          編集
        </Link> */}
        <form action={deleteTaskAction.bind(null, task.ID)}>
          <button
            type="submit"
            onClick={(e) => {
              if (!confirm("本当にこのタスクを削除しますか？")) {
                e.preventDefault();
              }
            }}
            className="text-red-600 hover:text-red-900"
          >
            削除
          </button>
        </form>
      </td>
    </tr>
  );
}

export default TaskRow;
