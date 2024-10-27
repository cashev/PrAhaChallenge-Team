package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"math/rand"
	"os"

	"gorm.io/gorm"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
)

func main() {
	database.Connect()
	clearDatabase(database.DB)

	createSeasonAndTeam(database.DB)
	createGenresAndTasks(database.DB)
	createGenrePublications(database.DB)
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

type name struct {
	first string
	last  string
}

func readNames(path string) ([]name, error) {
	names := []name{}
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}

	for i, record := range records {
		if i == 0 {
			continue // ヘッダーをスキップ
		}
		if len(record) >= 2 {
			names = append(names, name{
				last:  record[0],
				first: record[1],
			})
		}
	}

	return names, nil
}

func createSeasonAndTeam(db *gorm.DB) {
	// 期とチームの作成
	var teams []models.Team
	// 9つの期を作成
	for i := 1; i <= 9; i++ {
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

	names, err := readNames("database/test_util/students.csv")
	if err != nil {
		log.Fatalf("Failed to read names: %v", err)
	}

	// 受講中の学生を作成（各期3チーム、各チーム3人で計81人）
	for i := 0; i < 81; i++ {
		student := models.Student{
			FirstName: names[i].first,
			LastName:  names[i].last,
			Status:    "受講中",
		}
		db.Create(&student)
		// チームへの振り分け
		teamIndex := i / 3 // 3人ごとに次のチームに

		teamStudent := models.TeamStudent{
			TeamID:    teams[teamIndex].ID,
			StudentID: student.ID,
		}
		db.Create(&teamStudent)
	}

	// 休会中の受講生を27人作成
	for i := 81; i < 108; i++ {
		student := models.Student{
			FirstName: names[i].first,
			LastName:  names[i].last,
			Status:    "休会中",
		}
		db.Create(&student)
	}

	// 退会済みの受講生を12人作成
	for i := 108; i < 120; i++ {
		student := models.Student{
			FirstName: names[i].first,
			LastName:  names[i].last,
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
		{Name: "インフラ", DisplayOrder: 5},
		{Name: "セキュリティ", DisplayOrder: 6},
		{Name: "アルゴリズム", DisplayOrder: 7},
		{Name: "機械学習", DisplayOrder: 8},
		{Name: "モバイルアプリ開発", DisplayOrder: 9},
		{Name: "DevOps", DisplayOrder: 10},
	}
	for i := range genres {
		db.Create(&genres[i])
	}

	// 課題の作成
	tasks := []models.Task{
		{Title: "データベース設計", Text: "データベースの設計を行う", DisplayOrder: 1},
		{Title: "アンチパターン", Text: "アンチパターンの理解を深める", DisplayOrder: 2},
		{Title: "SQL", Text: "SQLの理解を深める", DisplayOrder: 3},
		{Title: "Reactの基礎", Text: "Reactの基本構文を学ぶ", DisplayOrder: 1},
		{Title: "コンポーネント", Text: "コンポーネントの理解を深める", DisplayOrder: 2},
		{Title: "テスト自動化", Text: "テストの自動化を行う", DisplayOrder: 1},
		{Title: "E2Eテスト", Text: "E2Eテストの実装を行う", DisplayOrder: 2},
		{Title: "API設計", Text: "APIの設計を行う", DisplayOrder: 1},
		{Title: "NoSQL", Text: "NoSQLデータベースの基礎を学ぶ", DisplayOrder: 4},
		{Title: "インデックス最適化", Text: "データベースのインデックス最適化を行う", DisplayOrder: 5},
		{Title: "状態管理", Text: "Reduxなどを使った状態管理を学ぶ", DisplayOrder: 3},
		{Title: "パフォーマンス最適化", Text: "フロントエンドのパフォーマンス最適化を行う", DisplayOrder: 4},
		{Title: "ユニットテスト", Text: "ユニットテストの作成方法を学ぶ", DisplayOrder: 3},
		{Title: "モックとスタブ", Text: "モックとスタブの使い方を学ぶ", DisplayOrder: 4},
		{Title: "マイクロサービス", Text: "マイクロサービスアーキテクチャを学ぶ", DisplayOrder: 2},
		{Title: "認証と認可", Text: "APIの認証と認可の実装を行う", DisplayOrder: 3},
		{Title: "コンテナ化", Text: "アプリケーションのコンテナ化を行う", DisplayOrder: 1},
		{Title: "CI/CD", Text: "CI/CDパイプラインの構築を行う", DisplayOrder: 2},
		{Title: "脆弱性診断", Text: "アプリケーションの脆弱性診断を行う", DisplayOrder: 1},
		{Title: "暗号化", Text: "データの暗号化手法を学ぶ", DisplayOrder: 2},
		{Title: "ソート", Text: "様々なソートアルゴリズムを実装する", DisplayOrder: 1},
		{Title: "グラフ理論", Text: "グラフ理論の基礎と応用を学ぶ", DisplayOrder: 2},
		{Title: "教師あり学習", Text: "教師あり学習の基礎を学ぶ", DisplayOrder: 1},
		{Title: "深層学習", Text: "ニューラルネットワークの基礎を学ぶ", DisplayOrder: 2},
		{Title: "iOS開発", Text: "iOSアプリの基礎開発を行う", DisplayOrder: 1},
		{Title: "Android開発", Text: "Androidアプリの基礎開発を行う", DisplayOrder: 2},
		{Title: "クラウドインフラ", Text: "クラウドインフラの構築と管理を学ぶ", DisplayOrder: 1},
		{Title: "モニタリング", Text: "アプリケーションのモニタリングを実装する", DisplayOrder: 3},
		{Title: "負荷テスト", Text: "アプリケーションの負荷テストを実施する", DisplayOrder: 2},
		{Title: "コードレビュー", Text: "効果的なコードレビューの方法を学ぶ", DisplayOrder: 3},
	}
	for i := range tasks {
		db.Create(&tasks[i])
	}

	// ジャンルと課題の関連付け
	genreTasks := []models.GenreTask{
		{GenreID: genres[0].ID, TaskID: tasks[0].ID},
		{GenreID: genres[0].ID, TaskID: tasks[1].ID},
		{GenreID: genres[0].ID, TaskID: tasks[2].ID},
		{GenreID: genres[0].ID, TaskID: tasks[8].ID},
		{GenreID: genres[0].ID, TaskID: tasks[9].ID},
		{GenreID: genres[1].ID, TaskID: tasks[3].ID},
		{GenreID: genres[1].ID, TaskID: tasks[4].ID},
		{GenreID: genres[1].ID, TaskID: tasks[10].ID},
		{GenreID: genres[1].ID, TaskID: tasks[11].ID},
		{GenreID: genres[2].ID, TaskID: tasks[5].ID},
		{GenreID: genres[2].ID, TaskID: tasks[6].ID},
		{GenreID: genres[2].ID, TaskID: tasks[12].ID},
		{GenreID: genres[2].ID, TaskID: tasks[13].ID},
		{GenreID: genres[3].ID, TaskID: tasks[7].ID},
		{GenreID: genres[3].ID, TaskID: tasks[14].ID},
		{GenreID: genres[3].ID, TaskID: tasks[15].ID},
		{GenreID: genres[4].ID, TaskID: tasks[16].ID},
		{GenreID: genres[4].ID, TaskID: tasks[17].ID},
		{GenreID: genres[4].ID, TaskID: tasks[27].ID},
		{GenreID: genres[5].ID, TaskID: tasks[18].ID},
		{GenreID: genres[5].ID, TaskID: tasks[19].ID},
		{GenreID: genres[6].ID, TaskID: tasks[20].ID},
		{GenreID: genres[6].ID, TaskID: tasks[21].ID},
		{GenreID: genres[7].ID, TaskID: tasks[22].ID},
		{GenreID: genres[7].ID, TaskID: tasks[23].ID},
		{GenreID: genres[8].ID, TaskID: tasks[24].ID},
		{GenreID: genres[8].ID, TaskID: tasks[25].ID},
		{GenreID: genres[9].ID, TaskID: tasks[26].ID},
		{GenreID: genres[9].ID, TaskID: tasks[28].ID},
		{GenreID: genres[9].ID, TaskID: tasks[29].ID},
	}
	for _, genreTask := range genreTasks {
		db.Create(&genreTask)
	}
}

func createGenrePublications(db *gorm.DB) {
	var seasons []models.Season
	db.Order("number").Find(&seasons)

	var genres []models.Genre
	db.Order("display_order").Find(&genres)

	publicationCounts := map[string]int{
		"1-A": 10, "1-B": 9, "1-C": 9,
		"2-A": 9, "2-B": 9, "2-C": 8,
		"3-A": 8, "3-B": 8, "3-C": 7,
		"4-A": 7, "4-B": 7, "4-C": 6,
		"5-A": 6, "5-B": 6, "5-C": 5,
		"6-A": 5, "6-B": 5, "6-C": 4,
		"7-A": 4, "7-B": 4, "7-C": 3,
		"8-A": 3, "8-B": 3, "8-C": 2,
		"9-A": 2, "9-B": 2, "9-C": 1,
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
