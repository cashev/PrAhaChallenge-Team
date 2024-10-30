import type { Task, TaskByStudentResponse } from '@/lib/backend/types/task'

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${process.env.BACKEND_URL}/tasks`)
  const { tasks } = await response.json()
  return tasks
}

export async function getTask(taskId: number): Promise<Task> {
  const response = await fetch(`${process.env.BACKEND_URL}/tasks/${taskId}`, {
    next: { revalidate: 0 },
  })
  const { task } = await response.json()
  return task
}

export async function createTask(
  title: string,
  text: string,
  genreId: number,
  displayOrder: number,
): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Title: title,
      Text: text,
      GenreID: genreId,
      DisplayOrder: displayOrder,
    }),
  })
}

export async function updateTask(
  taskId: number,
  title: string,
  text: string,
  genreId: number,
  displayOrder: number,
): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Title: title,
      Text: text,
      GenreID: genreId,
      DispalyOrder: displayOrder,
    }),
  })
}

export async function deleteTask(taskId: number): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  })
}

export async function getTasksByStudent(
  token: string,
): Promise<TaskByStudentResponse[]> {
  const response = await fetch(`${process.env.BACKEND_URL}/student/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const { tasks } = await response.json()
  return tasks
}
