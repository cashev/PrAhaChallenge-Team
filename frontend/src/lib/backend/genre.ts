import type { Genre, GenreOrder, GenreWithReference } from './types/genre'

export async function getGenres(): Promise<GenreWithReference[]> {
  const response = await fetch(`${process.env.BACKEND_URL}/genres`, {
    next: { revalidate: 0 },
  })
  const { genres } = await response.json()
  return genres
}

export async function getGenre(genreId: number): Promise<Genre> {
  const response = await fetch(`${process.env.BACKEND_URL}/genres/${genreId}`, {
    next: { revalidate: 0 },
  })
  const { genre } = await response.json()
  return genre
}

export async function createGenre(genreName: string): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/genres`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Name: genreName }),
  })
}

export async function updateGenre(
  genreId: number,
  genreName: string,
): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/genres/${genreId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Name: genreName }),
  })
}

export async function deleteGenre(genreId: number): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/genres/${genreId}`, {
    method: 'DELETE',
  })
}

export async function updateGenreOrders(
  genreOrders: GenreOrder[],
): Promise<void> {
  await fetch(`${process.env.BACKEND_URL}/genres/order`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(genreOrders),
  })
}
