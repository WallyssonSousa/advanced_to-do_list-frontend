import { apiFetch } from "./api"
import {
  RegisterUserDTO,
  RegisterResponse,
  UserSearchResult,
} from "@/types/user"

export async function registerUser(
  data: RegisterUserDTO
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getUsers(email = ""): Promise<UserSearchResult[]> {
  const query = email ? `?email=${encodeURIComponent(email)}` : ""

  return apiFetch<UserSearchResult[]>(`/users${query}`, {
    method: "GET",
  })
}