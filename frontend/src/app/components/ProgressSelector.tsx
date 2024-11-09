'use client'

import TaskProgressTable from '@/app/components/TaskProgressTable'
import type { GetSeasonsResponse } from '@/lib/backend/types/season-type'
import type { TaskAndProgress, TeamAndStudent } from '@/lib/backend/types/task'
import type React from 'react'
import { useState } from 'react'

type ProgressSelectorProps = {
  seasons: GetSeasonsResponse[]
  initialTasks: TaskAndProgress[]
  initialTeams: TeamAndStudent[]
  handleSeasonChange: (
    season: number,
  ) => Promise<{ tasks: TaskAndProgress[]; teams: TeamAndStudent[] }>
  updateTaskProgress: (
    taskID: number,
    studentID: number,
    status: string,
  ) => Promise<void>
}

const ProgressSelector = ({
  seasons,
  initialTasks,
  initialTeams,
  handleSeasonChange,
  updateTaskProgress,
}: ProgressSelectorProps) => {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0].Number)
  const [tasks, setTasks] = useState(initialTasks)
  const [teams, setTeams] = useState(initialTeams)

  const onSeasonChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const season = parseInt(e.target.value)
    setSelectedSeason(season)
    const { tasks, teams } = await handleSeasonChange(season)
    const sortedTasks = tasks.sort((a, b) => {
      if (a.GenreDisplayOrder === b.GenreDisplayOrder) {
        return a.DisplayOrder - b.DisplayOrder
      }
      return a.GenreDisplayOrder - b.GenreDisplayOrder
    })
    setTasks(sortedTasks)
    setTeams(teams)
  }

  return (
    <div>
      <select
        onChange={onSeasonChange}
        value={selectedSeason}
        className="mb-4 bg-white py-3 text-lg text-black dark:bg-gray-800 dark:text-gray-200"
      >
        {seasons.map((season) => (
          <option key={season.ID} value={season.Number}>
            {season.Number}期
          </option>
        ))}
      </select>
      <TaskProgressTable
        tasks={tasks}
        teams={teams}
        currentStudentID={undefined}
        updateTaskProgress={updateTaskProgress}
      />
    </div>
  )
}

export default ProgressSelector
