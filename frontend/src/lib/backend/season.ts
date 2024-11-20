import type { GetSeasonsResponse } from './types/season-type'

export const getSeasons = async (): Promise<GetSeasonsResponse[]> => {
  const response = await fetch(`${process.env.BACKEND_URL}/seasons`)
  const { seasons } = await response.json()
  return seasons
}

export const getNextSeasonNumber = async (): Promise<number> => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/seasons/next-number`,
    {
      cache: 'no-store',
    },
  )
  const { nextNumber } = await response.json()
  return nextNumber
}
