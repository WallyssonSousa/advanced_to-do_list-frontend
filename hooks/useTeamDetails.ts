"use client"

import { useEffect, useState } from "react"
import { getTeamUsers } from "@/services/teamService"
import { TeamUser } from "@/types/team"

export function useTeamDetails(teamUUID: string) {
  const [users, setUsers] = useState<TeamUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = async () => {
    setIsLoading(true)

    try {
      const data = await getTeamUsers(teamUUID)
      setUsers(data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (teamUUID) fetchUsers()
  }, [teamUUID])

  return {
    users,
    isLoading,
    refresh: fetchUsers,
  }
}
