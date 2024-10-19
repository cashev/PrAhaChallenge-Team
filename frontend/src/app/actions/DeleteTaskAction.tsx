'use server'

import { deleteTask } from "@/lib/backend/tasks";
import { revalidatePath } from "next/cache";

export async function deleteTaskAction(taskId: number) {
  try {
    await deleteTask(taskId);
    revalidatePath('/tasks'); // タスク一覧ページのパスを指定
  } catch (error) {
    console.error("タスクの削除中にエラーが発生しました:", error);
    throw new Error("タスクの削除に失敗しました");
  }
}
