import React from "react";
import { fetchTasks } from "@/lib/backend/tasks";
import TaskTable from "../components/TaskTable";

const TasksPage: React.FC = async () => {
  const tasks = await fetchTasks();
  
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            タスク一覧
          </h1>
        </div>
        <TaskTable tasks={tasks} />
      </div>
    </main>
  );
}

export default TasksPage;
