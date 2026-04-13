"use client"

import useSWR from "swr"
import { getTeams } from "@/services/teamService"
import { Team } from "@/types/team"

export function useTeams() {
  const { data, error, isLoading, mutate } = useSWR<Team[]>(
    "teams",
    getTeams
  )

  return {
    teams: data ?? [],
    isLoading,
    isError: !!error,
    refresh: mutate,
  }
}