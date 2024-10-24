import type { GenrePublication } from '@/lib/backend/types/genrePublication'

export async function getGenrePublications(): Promise<GenrePublication[]> {
  const response = await fetch(`${process.env.BACKEND_URL}/genre-publications`)
  const { genrePublications } = await response.json()
  return genrePublications
}
