import { apiFetch } from "./api"
import { RegisterUserDTO, RegisterResponse } from "@/types/user"

export async function registerUser(
  data: RegisterUserDTO
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  })
}