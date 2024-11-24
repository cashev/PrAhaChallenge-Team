import type {
  StatusChangeRequest,
  StatusChangeType,
} from './types/contact-type'

export const submitStatusChangeRequest = async (
  accessToken: string,
  studentId: number,
  type: StatusChangeType,
  reason: string,
  requestDate: Date,
  suspensionPeriod?: number,
) => {
  // 日付の時刻部分を0時0分0秒に設定
  const normalizedDate = new Date(requestDate)
  normalizedDate.setHours(0, 0, 0, 0)

  const response = await fetch(
    `${process.env.BACKEND_URL}/student/status-change-request`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        StudentID: studentId,
        Type: type,
        Reason: reason,
        RequestDate: normalizedDate,
        SuspensionPeriod: suspensionPeriod,
      }),
    },
  )
  return await response.json()
}

export const getStatusChangeRequest = async (id: number) => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/status-change-requests/${id}`,
    {
      next: { revalidate: 0 },
    },
  )
  const { request } = await response.json()
  return request as StatusChangeRequest
}

export const getUnprocessedStatusChangeRequests = async () => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/status-change-requests/unprocessed`,
    {
      next: { revalidate: 0 },
    },
  )
  const { requests } = await response.json()
  return requests as StatusChangeRequest[]
}

export const getProcessedStatusChangeRequests = async () => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/status-change-requests/processed`,
    {
      next: { revalidate: 0 },
    },
  )
  const { requests } = await response.json()
  return requests as StatusChangeRequest[]
}

export const processStatusChangeRequest = async (id: number) => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/status-change-requests/process`,
    {
      method: 'POST',
      body: JSON.stringify({
        ID: id,
      }),
    },
  )
  return await response.json()
}
