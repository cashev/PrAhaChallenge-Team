import type { GetTeamsResponse } from './types/team-type'

export const getTeams = async (): Promise<GetTeamsResponse[]> => {
  const response = await fetch(`${process.env.BACKEND_URL}/teams`)
  const { teams } = await response.json()
  return teams
}
