'use client'

import type {
  GetGenrePublicationResponse,
  UpdateGenrePublicationRequest,
} from '@/lib/backend/types/genrePublication'
import type React from 'react'
import { useState } from 'react'
import GenrePublicationTable from './GenrePublicationTable'

interface GenrePublicationEditorProps {
  initialData: GetGenrePublicationResponse
  saveGenrePublications: (
    data: UpdateGenrePublicationRequest[],
  ) => Promise<void>
}

const GenrePublicationEditor: React.FC<GenrePublicationEditorProps> = ({
  initialData,
  saveGenrePublications,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [data, setData] = useState(initialData)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    const updatedData = data.Genres.flatMap((genre) =>
      genre.SeasonTeams.flatMap((seasonTeam) =>
        seasonTeam.Teams.map((team) => ({
          GenreID: genre.GenreID,
          SeasonID: seasonTeam.ID,
          TeamID: team.ID,
          IsPublished: team.IsPublished,
        })),
      ),
    )
    await saveGenrePublications(updatedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setData(initialData)
    setIsEditing(false)
  }

  const handleChange = (updatedData: GetGenrePublicationResponse) => {
    setData(updatedData)
  }

  return (
    <div>
      <div className="mb-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              保存
            </button>
            <button
              onClick={handleCancel}
              className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
            >
              キャンセル
            </button>
          </>
        ) : (
          <button
            onClick={handleEdit}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            編集
          </button>
        )}
      </div>
      <GenrePublicationTable
        data={data}
        isEditing={isEditing}
        onChange={handleChange}
      />
    </div>
  )
}

export default GenrePublicationEditor
