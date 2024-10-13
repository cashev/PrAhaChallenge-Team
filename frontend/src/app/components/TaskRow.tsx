import React from "react";
import { Task } from "@/lib/backend/types/task";

interface TaskRowProps {
  task: Task;
}

const TaskRow: React.FC<TaskRowProps> = ({ task }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.Title}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.TaskGenre.GenreName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.Text}</td>
    </tr>
  );
}

export default TaskRow;
