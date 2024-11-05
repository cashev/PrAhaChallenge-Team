import ProgressSelector from '@/app/components/ProgressSelector'
import { getSeasons } from '@/lib/backend/season'
import { getTasksAndProgressBySeason } from '@/lib/backend/task'

const handleSeasonChange = async (season: number) => {
  'use server'
  const { tasks, teams } = await getTasksAndProgressBySeason(season)
  return { tasks, teams }
}

const handleUpdateTaskProgress = async (
  taskID: number,
  studentID: number,
  status: string,
) => {
  'use server'
  console.log(taskID, studentID, status)
}

const ProgressPage = async () => {
  const seasons = await getSeasons()
  if (!seasons) return <div>読み込み中...</div>

  const { tasks, teams } = await getTasksAndProgressBySeason(seasons[0].Number)
  const sortedTasks = tasks.sort((a, b) => {
    if (a.GenreDisplayOrder === b.GenreDisplayOrder) {
      return a.DisplayOrder - b.DisplayOrder
    }
    return a.GenreDisplayOrder - b.GenreDisplayOrder
  })

  return (
    <div className="overflow-x-auto bg-white shadow sm:rounded-lg dark:bg-gray-800">
      <div className="px-4 py-5 sm:p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          課題進捗一覧
        </h1>
        <ProgressSelector
          seasons={seasons}
          initialTasks={sortedTasks}
          initialTeams={teams}
          handleSeasonChange={handleSeasonChange}
          updateTaskProgress={handleUpdateTaskProgress}
        />
      </div>
    </div>
  )
}

export default ProgressPage
