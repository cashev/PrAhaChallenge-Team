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

export interface TaskAndProgressResponse {
  tasks: TaskAndProgress[]
  teams: TeamAndStudent[]
}

export interface TaskAndProgress {
  ID: number
  Title: string
  GenreID: number
  GenreName: string
  GenreDisplayOrder: number
  DisplayOrder: number
  Text: string
  Progress: Progress[]
}

export interface Progress {
  StudentID: number
  Status: string
}

export interface TeamAndStudent {
  ID: number
  Name: string
  Students: Student[]
}

export interface Student {
  ID: number
  Name: string
}
