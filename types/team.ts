export interface Team {
  uuid: string
  name: string
  description: string
  responsavel: string
}

export interface CreateTeamDTO {
  name: string
  description: string
  userUUID: string
}

export interface UpdateTeamDTO {
  name?: string
  description?: string
  usersToAdd?: string[]
}

export interface TeamUser {
  uuid: string
  name: string
  isAdmin: boolean
}

export interface GetTeamUsersResponse {
  users: TeamUser[]
}

export interface LeaveTeamDTO {
  newAdminUUID?: string
}