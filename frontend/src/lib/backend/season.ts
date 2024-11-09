import type { GetSeasonsResponse } from './types/season-type'

export const getSeasons = async (): Promise<GetSeasonsResponse[]> => {
  const response = await fetch(`${process.env.BACKEND_URL}/seasons`)
  const { seasons } = await response.json()
  return seasons
}
