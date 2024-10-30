import type { StudentInfoResponse } from './types/student-type'

export const getStudentInfo = async (
  studentId: string,
): Promise<StudentInfoResponse> => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/students/${studentId}`,
    {
      cache: 'no-store',
    },
  )
  return await response.json()
}
