import type { LoginAsStudentResponse } from '@/lib/backend/types/auth-type'

export async function loginAsStudent(
  email: string,
): Promise<LoginAsStudentResponse> {
  const response = await fetch(`${process.env.BACKEND_URL}/login-as-student`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Email: email,
    }),
  })

  if (!response.ok) {
    throw new Error('ログインに失敗しました')
  }
  const responseBody = await response.json()
  return responseBody
}
