export interface StudentInfoResponse {
  StudentID: number
  SeasonID: number
  Season: number
  TeamID: number
  TeamName: string
  FirstName: string
  LastName: string
}

export interface Student {
  StudentID: number
  FirstName: string
  LastName: string
  Status: string
  SuspensionStartDate: string | undefined
  SuspensionEndDate: string | undefined
  WithdrawalDate: string | undefined
  SeasonID: number | undefined
  SeasonNumber: number | undefined
  TeamID: number | undefined
  TeamName: string | undefined
}

export interface StudentsResponse {
  students: Student[]
  totalCount: number
}

export interface RegisterRequest {
  SeasonNumber: number
  Teams: RegisterTeam[]
}

export interface RegisterTeam {
  TeamName: string
  Students: RegisterStudent[]
}

export interface RegisterStudent {
  FirstName: string
  LastName: string
  Email: string
}
