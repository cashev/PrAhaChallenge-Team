import React from "react";
import { fetchTasks } from "@/lib/backend/tasks";
import TaskTable from "../../components/TaskTable";
import Link from "next/link";

const TasksPage: React.FC = async () => {
  const tasks = await fetchTasks();
  
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            課題一覧
          </h1>
          <Link href="/admin/tasks/new" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            新規課題作成
          </Link>
        </div>
        <TaskTable tasks={tasks} />
      </div>
    </main>
  );
}

export default TasksPage;
