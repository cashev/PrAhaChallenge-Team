export type StatusChangeType = '休会' | '退会'

export type StatusChangeRequestStatus = '未対応' | '対応済'

export interface StatusChangeRequest {
  ID: number
  SeasonID: number
  Season: number
  TeamID: number
  TeamName: string
  StudentID: number
  StudentName: string
  Type: StatusChangeType
  Status: StatusChangeRequestStatus
  Reason: string
  RequestDate: Date
  SuspensionPeriod: number
  SubmittedDate: Date
  ProcessedDate: Date
}
