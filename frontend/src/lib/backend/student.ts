import type {
  RegisterRequest,
  Student,
  StudentChangeRequestResponse,
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

export async function updateStudent(student: Student): Promise<void> {
  const response = await fetch(
    `${process.env.BACKEND_URL}/students/${student.StudentID}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    },
  )

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || '更新に失敗しました')
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

export const getStudentStatusChangeRequest = async (
  studentId: number,
): Promise<StudentChangeRequestResponse> => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/students/${studentId}/status-change-requests`,
    {
      cache: 'no-store',
    },
  )
  const { data } = await response.json()
  return data
}
