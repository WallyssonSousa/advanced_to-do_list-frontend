export interface LoginDTO {
  email: string
  password: string
}

export interface LoginResponse {
  uuid: string
  token: string
  name?: string
  firstLogin?: boolean
}

export interface ChangePasswordDTO {
  email: string
  newPassword: string
}