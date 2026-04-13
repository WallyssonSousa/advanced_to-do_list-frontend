import { apiFetch } from "./api"
import { Team, CreateTeamDTO } from "@/types/team"

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