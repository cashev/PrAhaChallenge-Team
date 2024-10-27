import React from "react";
import { Task } from "@/lib/backend/types/task";
import TaskRow from "./TaskRow";
import { deleteTask } from "@/lib/backend/tasks";
import { revalidatePath } from "next/cache";

interface TaskTableProps {
  tasks: Task[];
}

const handleDeleteTask = async (taskId: number) => {
  'use server';
  await deleteTask(taskId);
  revalidatePath('/admin/tasks');
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">タイトル</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ジャンル</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">本文</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map((task) => (
              <TaskRow key={task.ID} task={task} onDelete={handleDeleteTask} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskTable;
