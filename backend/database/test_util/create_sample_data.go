package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

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
		tx.Unscoped().Where("1 = 1").Delete(&models.StudentStatusChangeRequest{})
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

type studentInfo struct {
	first string
	last  string
	email string
}

func readStudents(path string) ([]studentInfo, error) {
	students := []studentInfo{}
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
			students = append(students, studentInfo{
				last:  record[0],
				first: record[1],
				email: record[2],
			})
		}
	}

	return students, nil
}

func createSeasonAndTeam(db *gorm.DB) {
	// 期とチームの作成
	var teams []models.Team
	// 9つの期を作成
	for i := 1; i <= 9; i++ {
		season := models.Season{Number: uint(i)}
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

	students, err := readStudents("database/test_util/students.csv")
	if err != nil {
		log.Fatalf("Failed to read students: %v", err)
	}

	// 受講中の学生を作成（各期3チーム、各チーム3人で計81人）
	for i := 0; i < 81; i++ {
		student := models.Student{
			FirstName: students[i].first,
			LastName:  students[i].last,
			Email:     students[i].email,
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
		if i%10 == 0 {
			if (i/10)%2 == 0 {
				studentStatusChangeRequests := models.StudentStatusChangeRequest{
					SubmittedDate: time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.Local).Add(time.Duration(rand.Intn(int(time.Since(time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.Local)).Hours()))) * time.Hour),
					StudentID:     student.ID,
					Type:          "退会",
					RequestDate:   time.Date(time.Now().Year(), time.Now().Month()+1, 1, 0, 0, 0, 0, time.Local),
					Reason:        "退会を希望します。: " + students[i].first + " " + students[i].last,
					Status:        "未対応",
				}
				db.Create(&studentStatusChangeRequests)
			} else {
				studentStatusChangeRequests := models.StudentStatusChangeRequest{
					SubmittedDate: time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.Local).Add(time.Duration(rand.Intn(int(time.Since(time.Date(time.Now().Year(), time.Now().Month(), 1, 0, 0, 0, 0, time.Local)).Hours()))) * time.Hour),
					StudentID:     student.ID,
					Type:          "退会",
					RequestDate:   time.Date(time.Now().Year(), time.Now().Month()+1, 0, 0, 0, 0, 0, time.Local),
					Reason:        "退会を希望します。: " + students[i].first + " " + students[i].last,
					Status:        "未対応",
				}
				db.Create(&studentStatusChangeRequests)
			}
		}
	}

	// 休会中の受講生を27人作成
	for i := 81; i < 108; i++ {
		now := time.Now()
		startDate := time.Date(now.Year(), now.Month()-2, 1, 0, 0, 0, 0, time.Local)
		endDate := time.Date(now.Year(), now.Month()-1, 0, 23, 59, 59, 999999999, time.Local)
		diffDays := int(endDate.Sub(startDate).Hours() / 24)
		submittedDate := startDate.Add(time.Duration(rand.Intn(diffDays)) * 24 * time.Hour).Add(time.Duration(rand.Intn(24)) * time.Hour).Add(time.Duration(rand.Intn(60)) * time.Minute).Add(time.Duration(rand.Intn(60)) * time.Second)
		requestDate := time.Date(submittedDate.Year(), submittedDate.Month()+1, 1, 0, 0, 0, 0, time.Local)
		processedDate := submittedDate.Add(time.Duration(rand.Intn(2)+2) * 24 * time.Hour)
		suspensionEndDate := time.Date(requestDate.Year(), requestDate.Month()+3, 0, 0, 0, 0, 0, time.Local)
		student := models.Student{
			FirstName:           students[i].first,
			LastName:            students[i].last,
			Email:               students[i].email,
			Status:              "休会中",
			SuspensionStartDate: &requestDate,
			SuspensionEndDate:   &suspensionEndDate,
		}
		db.Create(&student)
		studentStatusChangeRequests := models.StudentStatusChangeRequest{
			SubmittedDate: submittedDate,
			StudentID:     student.ID,
			Type:          "休会",
			RequestDate:   requestDate,
			Reason:        "休会を希望します。: " + students[i].first + " " + students[i].last,
			Status:        "対応済",
			ProcessedDate: processedDate,
		}
		db.Create(&studentStatusChangeRequests)
	}

	// 退会済みの受講生を12人作成
	for i := 108; i < 120; i++ {
		submittedDate := time.Date(2024, time.Month(rand.Intn(10)+1), rand.Intn(30)+1, rand.Intn(24), rand.Intn(60), rand.Intn(60), 0, time.Local)
		requestDate := time.Date(submittedDate.Year(), submittedDate.Month()+1, 0, 0, 0, 0, 0, time.Local)
		processedDate := submittedDate.Add(time.Duration(rand.Intn(2)+2) * 24 * time.Hour)
		student := models.Student{
			FirstName:      students[i].first,
			LastName:       students[i].last,
			Email:          students[i].email,
			Status:         "退会済",
			WithdrawalDate: &requestDate,
		}
		db.Create(&student)
		studentStatusChangeRequests := models.StudentStatusChangeRequest{
			SubmittedDate: submittedDate,
			StudentID:     student.ID,
			Type:          "退会",
			RequestDate:   requestDate,
			Reason:        "退会を希望します。: " + students[i].first + " " + students[i].last,
			Status:        "対応済",
			ProcessedDate: processedDate,
		}
		db.Create(&studentStatusChangeRequests)
	}
}

func createGenresAndTasks(db *gorm.DB) {
	// ジャンルの作成
	genres := []models.Genre{
		{Name: "データベース設計", DisplayOrder: 1},
		{Name: "テスト", DisplayOrder: 2},
		{Name: "設計", DisplayOrder: 3},
		{Name: "フロントエンド", DisplayOrder: 4},
		{Name: "WEBの基礎", DisplayOrder: 5},
		{Name: "チーム開発", DisplayOrder: 6},
		{Name: "クラウドインフラ", DisplayOrder: 7},
		{Name: "サービス運用", DisplayOrder: 8},
		{Name: "高速MVP開発", DisplayOrder: 9},
	}
	for i := range genres {
		db.Create(&genres[i])
	}

	// 課題の作成
	tasks := []models.Task{
		{Title: "【課題サンプル】DBモデリング1", Text: "https://separated-rover-67e.notion.site/DB-1-5ef1d7f57e3c443b988d3900ab863963", DisplayOrder: 1},
		{Title: "【課題サンプル】データベース設計のアンチパターンを学ぶ", Text: "https://separated-rover-67e.notion.site/eb9c86b7f57f48ef8d002a1163c0530b", DisplayOrder: 2},
		{Title: "【課題サンプル】jestで単体テストを書こう", Text: "https://separated-rover-67e.notion.site/jest-1ea0f15ccdc94abab08c2d715f19d5d6", DisplayOrder: 1},
		{Title: "【課題サンプル】DDDを学ぶ（基礎）", Text: "https://separated-rover-67e.notion.site/DDD-ec92f5c10f63473a801b1b0e42dac99a", DisplayOrder: 1},
		{Title: "【課題サンプル】特大課題：プラハチャレンジをDDDで実装してみる", Text: "https://separated-rover-67e.notion.site/DDD-4f1534172a064ed2aa7d52489be45427", DisplayOrder: 2},
		{Title: "【課題サンプル】SWR/React Queryを理解する", Text: "https://separated-rover-67e.notion.site/SWR-React-Query-dcf81e04839a410eacd8c2bc40c6cb9e", DisplayOrder: 1},
		{Title: "【課題サンプル】再利用しやすいコンポーネントのcssを考える", Text: "https://separated-rover-67e.notion.site/css-47bd7bc8c82547d386a04b5879f03a73", DisplayOrder: 2},
		{Title: "【課題サンプル】よく使うHTTPヘッダを理解する", Text: "https://separated-rover-67e.notion.site/HTTP-c36c3410a2bc499ca86b2c5b6d6dd1ca", DisplayOrder: 1},
		{Title: "【課題サンプル】CORSについて理解する", Text: "https://separated-rover-67e.notion.site/CORS-a085c4f7e9184872976bddbb418847ac", DisplayOrder: 2},
		{Title: "【課題サンプル】CI環境を整備してみよう", Text: "https://separated-rover-67e.notion.site/CI-1cb8707be78e4657951045c4e39e827a", DisplayOrder: 1},
		{Title: "【課題サンプル】安全なIAMの設計を理解する", Text: "https://separated-rover-67e.notion.site/IAM-0de6c9a0c330421c892b77487500ddee", DisplayOrder: 1},
		{Title: "【課題サンプル】本番稼働中のデータベースをマイグレーションしよう", Text: "https://separated-rover-67e.notion.site/04198ba15e6b4ab798875bcd4574b765", DisplayOrder: 1},
		{Title: "【課題サンプル】Firestoreを使ってリレーショナルDB以外にも慣れる", Text: "https://separated-rover-67e.notion.site/Firestore-DB-e94c65b940ab4c0da9db894276d3d969", DisplayOrder: 1},
	}
	for i := range tasks {
		db.Create(&tasks[i])
	}

	// ジャンルと課題の関連付け
	genreTasks := []models.GenreTask{
		{GenreID: genres[0].ID, TaskID: tasks[0].ID},
		{GenreID: genres[0].ID, TaskID: tasks[1].ID},
		{GenreID: genres[1].ID, TaskID: tasks[2].ID},
		{GenreID: genres[2].ID, TaskID: tasks[3].ID},
		{GenreID: genres[2].ID, TaskID: tasks[4].ID},
		{GenreID: genres[3].ID, TaskID: tasks[5].ID},
		{GenreID: genres[3].ID, TaskID: tasks[6].ID},
		{GenreID: genres[4].ID, TaskID: tasks[7].ID},
		{GenreID: genres[4].ID, TaskID: tasks[8].ID},
		{GenreID: genres[5].ID, TaskID: tasks[9].ID},
		{GenreID: genres[6].ID, TaskID: tasks[10].ID},
		{GenreID: genres[7].ID, TaskID: tasks[11].ID},
		{GenreID: genres[8].ID, TaskID: tasks[12].ID},
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
		"1-A": 9, "1-B": 8, "1-C": 8,
		"2-A": 8, "2-B": 8, "2-C": 7,
		"3-A": 7, "3-B": 6, "3-C": 6,
		"4-A": 6, "4-B": 5, "4-C": 5,
		"5-A": 5, "5-B": 5, "5-C": 4,
		"6-A": 4, "6-B": 3, "6-C": 3,
		"7-A": 3, "7-B": 3, "7-C": 2,
		"8-A": 2, "8-B": 2, "8-C": 1,
		"9-A": 2, "9-B": 1, "9-C": 1,
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
