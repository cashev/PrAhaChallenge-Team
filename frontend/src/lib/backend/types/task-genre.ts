export interface TaskGenre {
  ID: number;
  GenreName: string;
}

export interface TaskGenreWithReference extends TaskGenre {
  IsReferenced: boolean;
}
