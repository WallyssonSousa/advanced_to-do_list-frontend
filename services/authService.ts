import { apiFetch } from "./api"
import { LoginDTO, LoginResponse, ChangePasswordDTO } from "@/types/auth"

export async function loginUser(
  data: LoginDTO
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function changeUserPassword(
  data: ChangePasswordDTO
): Promise<void> {
  return apiFetch<void>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  })
}