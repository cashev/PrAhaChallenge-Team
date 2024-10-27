import type {
  GetGenrePublicationResponse,
  UpdateGenrePublicationRequest,
} from '@/lib/backend/types/genrePublication'

export async function getGenrePublications(): Promise<GetGenrePublicationResponse> {
  const response = await fetch(`${process.env.BACKEND_URL}/genre-publications`)
  const { genrePublications } = await response.json()
  return genrePublications
}

export async function updatePublicationStatus(
  genrePublications: UpdateGenrePublicationRequest[],
): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/genre-publications`, {
    method: 'PATCH',
    body: JSON.stringify(genrePublications),
  })
}
