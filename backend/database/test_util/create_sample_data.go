package main

import (
	"fmt"
	"math/rand"

	"gorm.io/gorm"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
)

func main() {
	database.Connect()
	clearDatabase(database.DB)

	createSeasonAndTeam(database.DB)
	createGenresAndTasks(database.DB)
	createTaskPublications(database.DB)
	createTaskProgresses(database.DB)
}

func clearDatabase(db *gorm.DB) {
	// 各テーブルのデータを削除
	db.Transaction(func(tx *gorm.DB) error {
		tx.Unscoped().Where("1 = 1").Delete(&models.TaskProgress{})
		tx.Unscoped().Where("1 = 1").Delete(&models.TeamStudent{})
		tx.Unscoped().Where("1 = 1").Delete(&models.GenreTask{})
		tx.Unscoped().Where("1 = 1").Delete(&models.GenrePublication{})
		tx.Unscoped().Where("1 = 1").Delete(&models.SeasonTeam{})
		tx.Unscoped().Where("1 = 1").Delete(&models.Task{})
		tx.Unscoped().Where("1 = 1").Delete(&models.Genre{})
		tx.Unscoped().Where("1 = 1").Delete(&models.Student{})
		tx.Unscoped().Where("1 = 1").Delete(&models.Team{})
		tx.Unscoped().Where("1 = 1").Delete(&models.Season{})
		return nil
	})
}

func createSeasonAndTeam(db *gorm.DB) {
	// 期とチームの作成
	var teams []models.Team
	// 3つの期を作成
	for i := 1; i <= 3; i++ {
		season := models.Season{Number: i}
		db.Create(&season)

		// 各期に3つのチームを作成
		for j := 'A'; j <= 'C'; j++ {
			team := models.Team{Name: fmt.Sprintf("%d-%c", i, j)}
			db.Create(&team)
			teams = append(teams, team)

			// SeasonTeamの作成
			seasonTeam := models.SeasonTeam{
				SeasonID: season.ID,
				TeamID:   team.ID,
			}
			db.Create(&seasonTeam)
		}
	}

	// 学生の作成と振り分け
	firstNames := []string{
		"Hiroshi", "Yoka", "Aoi", "Miku", "Isao", "Toshiki", "Kenjiro", "Koichiro", "Shunji", "Ouka",
		"Tomoko", "Hiroyuki", "Kenichi", "Kosaku", "Shizuka", "Yasuyuki", "Yuji", "Iwao", "Mitsumasa", "Tatsuya",
		"Kazuo", "Shizuka", "Fumiko", "Kanako", "Masato", "Haruka", "Yasuko", "Hinano", "Muneue", "Noa",
		"Mikio", "Kurumi", "Haruyuki", "Ichiro", "Naoko", "Itsuki", "Masatoshi", "Ibuki", "Kichiro", "Kanji",
	}
	lastNames := []string{
		"Fukawa", "Yamaguchi", "Yuasa", "Takagi", "Toki", "Nakano", "Akahori", "Tajiri", "Kikuchi", "Jin",
		"Murano", "Masuda", "Tayama", "Niinomi", "Ino", "Ochi", "Yuki", "Nishida", "Sakamoto", "Hiwatashi",
		"Shida", "Hamada", "Katsube", "Nishimura", "Watanuki", "Asada", "Sanpei", "Matsumiya", "Totsuka", "Hatano",
		"Eto", "Omura", "Furuichi", "Nagasaka", "Kurosu", "Shirata", "Matsumaru", "Fukuyama", "Yahagi", "Takashima",
	}

	for i := 0; i < 24; i++ {
		student := models.Student{
			FirstName: firstNames[i],
			LastName:  lastNames[i],
			Status:    "受講中",
		}
		db.Create(&student)
		// チームへの振り分け
		var teamIndex int
		if i < 18 {
			// 1-a, 1-b, 2-a, 2-b, 3-a, 3-bに各3人
			teamIndex = []int{0, 1, 3, 4, 6, 7}[i%6]
		} else {
			// 1-c, 2-c, 3-cに各2人
			teamIndex = []int{2, 5, 8}[i%3]
		}

		teamStudent := models.TeamStudent{
			TeamID:    teams[teamIndex].ID,
			StudentID: student.ID,
		}
		db.Create(&teamStudent)
	}

	// 休会中の受講生を12人作成
	for i := 24; i < 36; i++ {
		student := models.Student{
			FirstName: firstNames[i%len(firstNames)],
			LastName:  lastNames[i%len(lastNames)],
			Status:    "休会中",
		}
		db.Create(&student)
	}

	// 退会済みの受講生を4人作成
	for i := 36; i < 40; i++ {
		student := models.Student{
			FirstName: firstNames[i%len(firstNames)],
			LastName:  lastNames[i%len(lastNames)],
			Status:    "退会済",
		}
		db.Create(&student)
	}
}

func createGenresAndTasks(db *gorm.DB) {
	// ジャンルの作成
	genres := []models.Genre{
		{Name: "データベース", DisplayOrder: 1},
		{Name: "フロントエンド", DisplayOrder: 2},
		{Name: "テスト", DisplayOrder: 3},
		{Name: "バックエンド", DisplayOrder: 4},
	}
	for i := range genres {
		db.Create(&genres[i])
	}

	// タスクの作成
	tasks := []models.Task{
		{Title: "データベース設計", Text: "データベースの設計を行う", DisplayOrder: 1},
		{Title: "アンチパターン", Text: "アンチパターンの理解を深める", DisplayOrder: 2},
		{Title: "SQL", Text: "SQLの理解を深める", DisplayOrder: 3},
		{Title: "Reactの基礎", Text: "Reactの基本構文を学ぶ", DisplayOrder: 1},
		{Title: "コンポーネント", Text: "コンポーネントの理解を深める", DisplayOrder: 2},
		{Title: "テスト自動化", Text: "テストの自動化を行う", DisplayOrder: 1},
		{Title: "E2Eテスト", Text: "E2Eテストの実装を行う", DisplayOrder: 2},
		{Title: "API設計", Text: "APIの設計を行う", DisplayOrder: 1},
	}
	for i := range tasks {
		db.Create(&tasks[i])
	}

	// ジャンルとタスクの関連付け
	genreTasks := []models.GenreTask{
		{GenreID: genres[0].ID, TaskID: tasks[0].ID},
		{GenreID: genres[0].ID, TaskID: tasks[1].ID},
		{GenreID: genres[0].ID, TaskID: tasks[2].ID},
		{GenreID: genres[1].ID, TaskID: tasks[3].ID},
		{GenreID: genres[1].ID, TaskID: tasks[4].ID},
		{GenreID: genres[2].ID, TaskID: tasks[5].ID},
		{GenreID: genres[2].ID, TaskID: tasks[6].ID},
		{GenreID: genres[3].ID, TaskID: tasks[7].ID},
	}
	for _, genreTask := range genreTasks {
		db.Create(&genreTask)
	}
}

func createTaskPublications(db *gorm.DB) {
	var seasons []models.Season
	db.Order("number").Find(&seasons)

	var genres []models.Genre
	db.Order("display_order").Find(&genres)

	publicationCounts := map[string]int{
		"1-A": 4, "1-B": 3, "1-C": 3,
		"2-A": 3, "2-B": 2, "2-C": 2,
		"3-A": 2, "3-B": 2, "3-C": 1,
	}

	for _, season := range seasons {
		for teamLetter := 'A'; teamLetter <= 'C'; teamLetter++ {
			teamName := fmt.Sprintf("%d-%c", season.Number, teamLetter)
			var team models.Team
			db.Where("name = ?", teamName).First(&team)

			count := publicationCounts[teamName]
			for i := 0; i < len(genres); i++ {
				genrePublication := models.GenrePublication{
					SeasonID:    season.ID,
					TeamID:      team.ID,
					GenreID:     genres[i].ID,
					IsPublished: i <= count-1,
				}
				db.Create(&genrePublication)
			}
		}
	}
}

func createTaskProgresses(db *gorm.DB) {
	var genres []models.Genre
	db.Order("display_order").Find(&genres)

	var allTasks []models.Task
	db.Order("display_order").Find(&allTasks)

	// タスクをジャンルごとにマッピング
	tasksByGenre := make(map[uint][]models.Task)
	for _, task := range allTasks {
		var genreTask models.GenreTask
		db.Where("task_id = ?", task.ID).First(&genreTask)
		tasksByGenre[genreTask.GenreID] = append(tasksByGenre[genreTask.GenreID], task)
	}

	var students []models.Student
	db.Where("status = ?", "受講中").Find(&students)

	for _, student := range students {
		// 学生のチームを取得
		var teamStudent models.TeamStudent
		db.Where("student_id = ?", student.ID).First(&teamStudent)

		// チームに公開されたジャンルを取得
		var genrePublications []models.GenrePublication
		db.Where("team_id = ?", teamStudent.TeamID).Find(&genrePublications)

		var availableTasks []models.Task
		for _, publication := range genrePublications {
			availableTasks = append(availableTasks, tasksByGenre[publication.GenreID]...)
		}

		if len(availableTasks) == 0 {
			continue // 公開されたタスクがない場合はスキップ
		}

		// ランダムで着手中の課題を決定（公開されたタスクの中から）
		inProgressIndex := rand.Intn(len(availableTasks))

		for i, task := range availableTasks {
			var status string
			if i == inProgressIndex {
				status = "着手中"
			} else if i == inProgressIndex-1 || i == inProgressIndex-2 {
				status = "レビュー待ち"
			} else if i < inProgressIndex-2 {
				status = "完了"
			} else {
				status = "未着手"
			}

			taskProgress := models.TaskProgress{
				StudentID: student.ID,
				TaskID:    task.ID,
				Status:    status,
			}
			db.Create(&taskProgress)
		}
	}
}
