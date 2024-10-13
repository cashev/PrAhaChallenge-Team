import { Task } from "@/lib/backend/types/task";

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${process.env.BACKEND_URL}/tasks`);
  const { tasks } = await response.json();
  return tasks;
}
