export interface StudentInfoResponse {
  StudentID: number
  SeasonID: number
  Season: number
  TeamID: number
  TeamName: string
  FirstName: string
  LastName: string
}

export interface StudentsResponse {
  StudentID: number
  FirstName: string
  LastName: string
  Status: string
  SuspensionStartDate: string | null
  SuspensionEndDate: string | null
  WithdrawalDate: string | null
  SeasonID: number | null
  SeasonNumber: number | null
  TeamID: number | null
  TeamName: string | null
}
