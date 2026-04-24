import { apiFetch } from "./api"
import {
  Team,
  CreateTeamDTO,
  UpdateTeamDTO,
  GetTeamUsersResponse,
  TeamUser,
  LeaveTeamDTO
} from "@/types/team"

export async function getTeams(): Promise<Team[]> {
  return apiFetch<Team[]>("/teams", {
    method: "GET",
  })
}

export async function createTeam(
  data: CreateTeamDTO
): Promise<Team> {
  return apiFetch<Team>("/teams", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getTeamUsers(
  teamUUID: string
): Promise<TeamUser[]> {
  const response = await apiFetch<GetTeamUsersResponse>(
    `/teams/${teamUUID}/users`,
    { method: "GET" }
  )

  return response.users
}

export async function updateTeam(
  teamUUID: string,
  data: UpdateTeamDTO
): Promise<void> {
  await apiFetch(`/teams/${teamUUID}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function leaveTeam(
  teamUUID: string,
  data: LeaveTeamDTO
): Promise<void> {
  await apiFetch(`/teams/${teamUUID}/leave`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}