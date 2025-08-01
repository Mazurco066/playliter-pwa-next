export type User = {
  isLoggedIn: boolean
  isEmailconfirmed: boolean
  name: string
  username: string
  avatar: string
  token: string
  refreshToken: string
  role: string
  email?: string
  id: string
}
