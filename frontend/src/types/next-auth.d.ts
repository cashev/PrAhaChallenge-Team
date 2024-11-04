import 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    user: {
      id?: string
      name?: string
    }
  }
  interface User {
    token?: string
    name?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    name?: string
  }
}
