import { Task,  } from "@/lib/backend/types/task";
import { TaskGenre } from "@/lib/backend/types/task-genre";

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${process.env.BACKEND_URL}/tasks`, { next: { revalidate: 0 } });
  const { tasks } = await response.json();
  return tasks;
}

export async function createTask(title: string, genre: TaskGenre, text: string): Promise<void> {
  console.log(JSON.stringify({ Title: title, TaskGenre: genre, Text: text }));
  await fetch(`${process.env.BACKEND_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Title: title, TaskGenre: genre, Text: text }),
  });
}

export async function updateTask(task: Task): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/tasks/update/${task.ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}

export async function deleteTask(task: Task): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/tasks/delete/${task.ID}`, {
    method: "POST",
  });
}

export async function fetchTaskGenres(): Promise<TaskGenre[]> {
  const response = await fetch(`${process.env.BACKEND_URL}/task_genres`);
  const { taskGenres } = await response.json();
  return taskGenres;
}

export async function createTaskGenre(name: string): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/task_genres`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
}

export async function updateTaskGenre(genre: TaskGenre): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/task_genres/update/${genre.ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(genre),
  });
}

export async function deleteTaskGenre(genre: TaskGenre): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/task_genres/delete/${genre.ID}`, {
    method: "POST",
  });
}
