import type { TaskPublication } from '@/lib/backend/types/taskPublication'

export async function getTaskPublications(): Promise<TaskPublication[]> {
  const response = await fetch(`${process.env.BACKEND_URL}/task-publications`)
  const { taskPublications } = await response.json()
  return taskPublications
}
