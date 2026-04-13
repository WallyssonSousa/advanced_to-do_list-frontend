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