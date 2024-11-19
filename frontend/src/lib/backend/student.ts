import type {
  RegisterRequest,
  StudentInfoResponse,
  StudentsResponse,
} from './types/student-type'

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

export const getStudents = async (
  filters: Record<string, string>,
): Promise<StudentsResponse> => {
  const queryParams = new URLSearchParams(filters).toString()

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/students?${queryParams}`,
      {
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch students')
    }

    const data: StudentsResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching students:', error)
    return {
      students: [],
      totalCount: 0,
    }
  }
}

export const registerStudents = async (
  request: RegisterRequest,
): Promise<string> => {
  const response = await fetch(`${process.env.BACKEND_URL}/students/register`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
  const { message } = await response.json()
  return message
}
