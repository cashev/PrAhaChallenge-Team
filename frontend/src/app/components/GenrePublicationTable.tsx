import type { GetGenrePublicationResponse } from '@/lib/backend/types/genrePublication'
import React from 'react'

interface GenrePublicationTableProps {
  data: GetGenrePublicationResponse
  isEditing: boolean
  onChange: (updatedData: GetGenrePublicationResponse) => void
}

const GenrePublicationTable: React.FC<GenrePublicationTableProps> = ({
  data,
  isEditing,
  onChange,
}) => {
  const { Genres, Seasons } = data
  const sortedGenres = Genres.sort((a, b) => a.DisplayOrder - b.DisplayOrder)
  const sortedSeasons = Seasons.sort((a, b) => a.Number - b.Number)
  const genreMap = new Map<number, Map<number, Map<number, boolean>>>()
  Genres.forEach((genre) => {
    const seasonMap = new Map<number, Map<number, boolean>>()
    genre.SeasonTeams.forEach((seasonTeam) => {
      const teamMap = new Map<number, boolean>()
      seasonTeam.Teams.forEach((team) => {
        teamMap.set(team.ID, team.IsPublished)
      })
      seasonMap.set(seasonTeam.ID, teamMap)
    })
    genreMap.set(genre.GenreID, seasonMap)
  })

  const handleTogglePublication = (
    genreId: number,
    seasonId: number,
    teamId: number,
  ) => {
    if (!isEditing) return

    const updatedData = { ...data }
    const genre = updatedData.Genres.find((g) => g.GenreID === genreId)
    if (genre) {
      const seasonTeam = genre.SeasonTeams.find((st) => st.ID === seasonId)
      if (seasonTeam) {
        const team = seasonTeam.Teams.find((t) => t.ID === teamId)
        if (team) {
          team.IsPublished = !team.IsPublished
          onChange(updatedData)
        }
      }
    }
  }

  return (
    <div
      className="relative overflow-auto"
      style={{ maxHeight: 'calc(100vh - 8rem)', maxWidth: '100%' }}
    >
      <div className="overflow-x-auto">
        <div
          className="overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 8rem)' }}
        >
          <table className="w-full border-collapse bg-white shadow-md dark:bg-gray-800">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="sticky left-0 z-20 border border-gray-300 bg-gray-200 p-2 dark:border-gray-600 dark:bg-gray-700"></th>
                {sortedSeasons.map((season) => (
                  <th
                    key={season.ID}
                    className="whitespace-nowrap border border-gray-300 p-2 text-gray-800 dark:border-gray-600 dark:text-gray-200"
                    colSpan={season.Teams.length}
                  >
                    {season.Number}期
                  </th>
                ))}
              </tr>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="sticky left-0 z-20 whitespace-nowrap border border-gray-300 bg-gray-200 p-2 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                  ジャンル
                </th>
                {sortedSeasons.map((season) => (
                  <React.Fragment key={season.ID}>
                    {season.Teams.sort((a, b) => a.ID - b.ID).map((team) => (
                      <th
                        key={`${season.ID}-${team.ID}`}
                        className="whitespace-nowrap border border-gray-300 p-2 text-gray-800 dark:border-gray-600 dark:text-gray-200"
                      >
                        {team.Name}
                      </th>
                    ))}
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedGenres.map((genre, index) => (
                <tr
                  key={genre.GenreID}
                  className={
                    index % 2 === 0
                      ? 'bg-gray-50 dark:bg-gray-900'
                      : 'bg-white dark:bg-gray-800'
                  }
                >
                  <td className="sticky left-0 z-10 whitespace-nowrap border border-gray-300 bg-inherit p-2 font-bold text-gray-800 dark:border-gray-600 dark:text-gray-200">
                    {genre.GenreName}
                  </td>
                  {sortedSeasons.map((season) => (
                    <React.Fragment key={`${genre.GenreID}-${season.ID}`}>
                      {season.Teams.sort((a, b) => a.ID - b.ID).map((team) => {
                        const publication = genreMap
                          .get(genre.GenreID)
                          ?.get(season.ID)
                          ?.get(team.ID)
                        return (
                          <td
                            key={`${genre.GenreID}-${season.ID}-${team.ID}`}
                            className="border border-gray-300 p-2 text-center dark:border-gray-600"
                            onClick={() =>
                              handleTogglePublication(
                                genre.GenreID,
                                season.ID,
                                team.ID,
                              )
                            }
                            style={{
                              cursor: isEditing ? 'pointer' : 'default',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={publication}
                              onChange={() => {}} // React の制御付きコンポーネントの警告を防ぐため
                              disabled={!isEditing}
                              className="size-4 cursor-pointer"
                            />
                          </td>
                        )
                      })}
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GenrePublicationTable
