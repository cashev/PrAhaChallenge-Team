export interface GetGenrePublicationResponse {
  Genres: GenrePublication[]
  Seasons: Season[]
}

export interface GenrePublication {
  GenreID: number
  GenreName: string
  DisplayOrder: number
  SeasonTeams: SeasonTeam[]
}

export interface SeasonTeam {
  ID: number
  Teams: TeamPublicationStatus[]
}

export interface TeamPublicationStatus {
  ID: number
  IsPublished: boolean
}

export interface Season {
  ID: number
  Number: number
  Teams: Team[]
}

export interface Team {
  ID: number
  Name: string
}

export interface UpdateGenrePublicationRequest {
  GenreID: number
  SeasonID: number
  TeamID: number
  IsPublished: boolean
}
