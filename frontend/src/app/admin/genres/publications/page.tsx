import { getGenrePublications } from '@/lib/backend/genrePublication'
import React from 'react'

interface Season {
  number: number
  teams: string[]
}

const GenrePublicationPage = async () => {
  const taskPublications = await getGenrePublications()

  // ジャンル、シーズン、チームごとにデータを整理
  const organizedData: Record<
    string,
    Record<number, Record<string, boolean>>
  > = {}
  const genreOrder: Record<string, number> = {}
  taskPublications.forEach((pub) => {
    if (!organizedData[pub.GenreName]) {
      organizedData[pub.GenreName] = {}
      genreOrder[pub.GenreName] = pub.GenreDisplayOrder
    }
    if (!organizedData[pub.GenreName][pub.SeasonNumber]) {
      organizedData[pub.GenreName][pub.SeasonNumber] = {}
    }
    organizedData[pub.GenreName][pub.SeasonNumber][pub.TeamName] =
      pub.IsPublished
  })

  // ユニークなシーズンとチームを取得
  const seasons: Season[] = Array.from(
    new Set(taskPublications.map((pub) => pub.SeasonNumber)),
  )
    .sort((a, b) => a - b)
    .map((season) => ({
      number: season,
      teams: Array.from(
        new Set(
          taskPublications
            .filter((pub) => pub.SeasonNumber === season)
            .map((pub) => pub.TeamName),
        ),
      ),
    }))

  // ジャンルをDisplayOrderでソート
  const sortedGenres = Object.keys(organizedData).sort(
    (a, b) => genreOrder[a] - genreOrder[b],
  )

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">ジャンル公開状況</h1>
      <table className="w-full border-collapse border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2"></th>
            {seasons.map((season) => (
              <th
                key={season.number}
                className="border border-gray-300 p-2"
                colSpan={season.teams.length}
              >
                {season.number}期
              </th>
            ))}
          </tr>
          <tr>
            <th className="border border-gray-300 p-2">ジャンル</th>
            {seasons.map((season) => (
              <React.Fragment key={season.number}>
                {season.teams.map((team) => (
                  <th
                    key={`${season}-${team}`}
                    className="border border-gray-300 p-2"
                  >
                    {team}
                  </th>
                ))}
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedGenres.map((genre) => (
            <tr key={genre}>
              <td className="border border-gray-300 p-2 font-bold">{genre}</td>
              {seasons.map((season) => (
                <React.Fragment key={`${genre}-${season.number}`}>
                  {season.teams.map((team) => (
                    <td
                      key={`${genre}-${season.number}-${team}`}
                      className="border border-gray-300 p-2 text-center"
                    >
                      {organizedData[genre][season.number]?.[team]
                        ? '✅'
                        : '❌'}
                    </td>
                  ))}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GenrePublicationPage
