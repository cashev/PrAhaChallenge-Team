export interface Genre {
  ID: number
  Name: string
  DisplayOrder: number
}

export interface GenreWithReference extends Genre {
  IsReferenced: boolean
}
