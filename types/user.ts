export interface RegisterUserDTO {
    name: string
    email: string
}

export interface RegisterResponse {
    sucess: boolean
    message: string
}

export interface UserSearchResult {
  name: string
  email: string
}