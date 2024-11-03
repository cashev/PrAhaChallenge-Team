export interface Task {
  ID: number
  Title: string
  GenreID: number
  GenreName: string
  GenreDisplayOrder: number
  Text: string
  DisplayOrder: number
}

export interface TaskOrder {
  TaskID: number
  NewOrder: number
}

export interface TaskByStudentResponse {
  ID: number
  Title: string
  GenreID: number
  GenreName: string
  GenreDisplayOrder: number
  DisplayOrder: number
  Text: string
}
