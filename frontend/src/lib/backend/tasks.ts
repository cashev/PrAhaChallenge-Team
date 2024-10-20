import { Task,  } from "@/lib/backend/types/task";
import { TaskGenre, TaskGenreWithReference } from "@/lib/backend/types/task-genre";

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${process.env.BACKEND_URL}/tasks`);
  const { tasks } = await response.json();
  return tasks;
}

export async function getTask(taskId: number): Promise<Task> {
  const response = await fetch(`${process.env.BACKEND_URL}/tasks/${taskId}`, { next: { revalidate: 0 } });
  const { task } = await response.json();
  return task;
}

export async function createTask(title: string, genre: TaskGenre, text: string): Promise<void> {
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

export async function deleteTask(taskId: number): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/tasks/delete/${taskId}`, {
    method: "POST",
  });
}

export async function fetchTaskGenres(): Promise<TaskGenreWithReference[]> {
  const response = await fetch(`${process.env.BACKEND_URL}/task_genres`, { next: { revalidate: 0 } });
  const { taskGenres } = await response.json();
  return taskGenres;
}

export async function getTaskGenre(genreId: number): Promise<TaskGenre> {
  const response = await fetch(`${process.env.BACKEND_URL}/task_genres/${genreId}`, { next: { revalidate: 0 } });
  const { taskGenre } = await response.json();
  return taskGenre;
}

export async function createTaskGenre(genreName: string): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/task_genres`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ GenreName: genreName }),
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

export async function deleteTaskGenre(genreId: number): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/task_genres/delete/${genreId}`, {
    method: "POST",
  });
}
