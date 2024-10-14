import { TaskGenre } from "./task-genre";

export interface Task {
  ID: number;
  Title: string;
  TaskGenre: TaskGenre;
  Text: string;
}
