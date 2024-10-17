import React from "react";
import { fetchTasks } from "@/lib/backend/tasks";
import Link from "next/link";
import TaskTable from "@/app/components/TaskTable";

const TasksPage: React.FC = async () => {
  const tasks = await fetchTasks();

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          課題一覧
        </h1>
        <div className="space-x-4">
          <Link href="/admin/tasks/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            課題追加
          </Link>
          <Link href="/admin/genres/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            ジャンル追加
          </Link>
        </div>
      </div>
      <TaskTable tasks={tasks} />
    </div>
  );
}

export default TasksPage;
