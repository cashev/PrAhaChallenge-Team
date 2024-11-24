package controller

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
	"github.com/cashev/PrAhaChallenge-Team/backend/util"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Student struct {
	ID                  uint       `json:"StudentID"`
	FirstName           string     `json:"FirstName"`
	LastName            string     `json:"LastName"`
	Status              string     `json:"Status"`
	SuspensionStartDate *time.Time `json:"SuspensionStartDate"`
	SuspensionEndDate   *time.Time `json:"SuspensionEndDate"`
	WithdrawalDate      *time.Time `json:"WithdrawalDate"`
	SeasonID            *uint      `json:"SeasonID"`
	SeasonNumber        *uint      `json:"SeasonNumber"`
	TeamID              *uint      `json:"TeamID"`
	TeamName            string     `json:"TeamName"`
}

type StudentsResponse struct {
	Students   []Student `json:"students"`
	TotalCount int64     `json:"totalCount"`
}

type StudentInfoResponse struct {
	StudentID uint   `json:"StudentID"`
	SeasonID  *uint  `json:"SeasonID"`
	Season    *uint  `json:"Season"`
	TeamID    *uint  `json:"TeamID"`
	TeamName  string `json:"TeamName"`
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
	Status    string `json:"Status"`
}

type UpdateStudentRequest struct {
	ID                  uint    `json:"StudentID"`
	FirstName           string  `json:"FirstName"`
	LastName            string  `json:"LastName"`
	Status              string  `json:"Status"`
	SuspensionStartDate *string `json:"SuspensionStartDate"`
	SuspensionEndDate   *string `json:"SuspensionEndDate"`
	WithdrawalDate      *string `json:"WithdrawalDate"`
	TeamID              *uint   `json:"TeamID"`
}

func getFilters(c *gin.Context) map[string]string {
	return map[string]string{
		"lastName":          c.DefaultQuery("lastName", ""),
		"firstName":         c.DefaultQuery("firstName", ""),
		"seasonNumber":      c.DefaultQuery("seasonNumber", ""),
		"teamName":          c.DefaultQuery("teamName", ""),
		"status":            c.DefaultQuery("status", ""),
		"suspensionEndDate": c.DefaultQuery("suspensionEndDate", ""),
		"withdrawalDate":    c.DefaultQuery("withdrawalDate", ""),
	}
}

func getTotalCount(query *gorm.DB) int64 {
	var totalCount int64
	if err := query.Count(&totalCount).Error; err != nil {
		return 0
	}
	return totalCount
}

func applySorting(query *gorm.DB, sortBy, sortOrder string) *gorm.DB {
	columnMap := map[string]string{
		"lastName":            "students.last_name",
		"firstName":           "students.first_name",
		"seasonNumber":        "seasons.number",
		"teamName":            "teams.name",
		"status":              "students.status",
		"suspensionStartDate": "students.suspension_start_date",
		"suspensionEndDate":   "students.suspension_end_date",
		"withdrawalDate":      "students.withdrawal_date",
	}

	if sortColumn, exists := columnMap[sortBy]; exists {
		return query.Order(sortColumn + " " + sortOrder + " NULLS LAST")
	}
	return query.Order("seasons.number ASC, students.id ASC")
}

func buildStudentQuery(db *gorm.DB, filters map[string]string) *gorm.DB {
	query := db.Table("students").
		Select("students.id, students.first_name, students.last_name, students.status, " +
			"students.suspension_start_date, students.suspension_end_date, students.withdrawal_date, " +
			"team_students.team_id, teams.name AS team_name, " +
			"season_teams.season_id, seasons.number AS season_number").
		Joins("LEFT JOIN  team_students ON team_students.student_id = students.id").
		Joins("LEFT JOIN  teams ON teams.id = team_students.team_id").
		Joins("LEFT JOIN  season_teams ON season_teams.team_id = team_students.team_id").
		Joins("LEFT JOIN seasons ON seasons.id = season_teams.season_id")

	// Apply filters
	if lastName := filters["lastName"]; lastName != "" {
		query = query.Where("students.last_name ILIKE ?", "%"+lastName+"%")
	}
	if firstName := filters["firstName"]; firstName != "" {
		query = query.Where("students.first_name ILIKE ?", "%"+firstName+"%")
	}
	if seasonNumber, _ := strconv.Atoi(filters["seasonNumber"]); seasonNumber != 0 {
		query = query.Where("seasons.number = ?", seasonNumber)
	}
	if teamName := filters["teamName"]; teamName != "" {
		query = query.Where("teams.name ILIKE ?", teamName+"%")
	}
	if status := filters["status"]; status != "" {
		query = query.Where("students.status = ?", status)
	}
	if suspensionEndDate := filters["suspensionEndDate"]; suspensionEndDate != "" {
		query = query.Where("students.suspension_end_date::date = ?", suspensionEndDate)
	}
	if withdrawalDate := filters["withdrawalDate"]; withdrawalDate != "" {
		year, month, _ := util.ParseYearMonth(withdrawalDate)
		startDate := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
		endDate := startDate.AddDate(0, 1, 0).Add(-time.Nanosecond)
		query = query.Where("students.withdrawal_date BETWEEN ? AND ?", startDate, endDate)
	}

	return query
}

func GetStudents(c *gin.Context) {
	var studentList []Student
	var totalCount int64

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	sortBy := c.DefaultQuery("sortBy", "")
	sortOrder := c.DefaultQuery("sortOrder", "")

	if page < 1 {
		page = 1
	}

	if pageSize < 1 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize

	filters := getFilters(c)
	baseQuery := buildStudentQuery(database.DB, filters)
	totalCount = getTotalCount(baseQuery)

	baseQuery = applySorting(baseQuery, sortBy, sortOrder)

	if err := baseQuery.Limit(pageSize).Offset(offset).Find(&studentList).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(studentList) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"students":   []Student{},
			"totalCount": totalCount,
		})
		return
	}

	response := StudentsResponse{
		Students:   studentList,
		TotalCount: totalCount,
	}

	c.JSON(http.StatusOK, response)
}

func GetStudentInfo(c *gin.Context) {
	studentID := c.Param("id")

	var studentInfo StudentInfoResponse
	var student models.Student
	result := database.DB.
		Preload("TeamStudents.Team.SeasonTeams.Season").
		Where("id = ?", studentID).
		First(&student)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch student info"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}

	if len(student.TeamStudents) > 0 {
		studentInfo = StudentInfoResponse{
			StudentID: student.ID,
			FirstName: student.FirstName,
			LastName:  student.LastName,
			TeamID:    &student.TeamStudents[0].Team.ID,
			TeamName:  student.TeamStudents[0].Team.Name,
			SeasonID:  &student.TeamStudents[0].Team.SeasonTeams[0].Season.ID,
			Season:    &student.TeamStudents[0].Team.SeasonTeams[0].Season.Number,
			Status:    student.Status,
		}
	} else {
		studentInfo = StudentInfoResponse{
			StudentID: student.ID,
			FirstName: student.FirstName,
			LastName:  student.LastName,
			TeamID:    nil,
			TeamName:  "",
			SeasonID:  nil,
			Season:    nil,
			Status:    student.Status,
		}
	}

	c.JSON(http.StatusOK, studentInfo)
}

func UpdateStudent(c *gin.Context) {
	var request UpdateStudentRequest
	id := c.Param("id")

	if err := c.ShouldBindJSON(&request); err != nil {
		log.Println("Error occurred:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx := database.DB.Begin()

	var student models.Student
	if err := tx.First(&student, id).Error; err != nil {
		tx.Rollback()
		log.Println("Error occurred:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "受講生が見つかりません"})
		return
	}

	updates := models.Student{}
	updates.FirstName = request.FirstName
	updates.LastName = request.LastName
	updates.Status = request.Status

	if request.SuspensionStartDate != nil {
		SuspensionStartDate, _ := time.Parse("2006-01-02", *request.SuspensionStartDate)
		updates.SuspensionStartDate = &SuspensionStartDate
	} else {
		updates.SuspensionStartDate = nil
	}

	if request.SuspensionEndDate != nil {
		SuspensionEndDate, _ := time.Parse("2006-01-02", *request.SuspensionEndDate)
		updates.SuspensionEndDate = &SuspensionEndDate
	} else {
		updates.SuspensionEndDate = nil
	}

	if request.WithdrawalDate != nil {
		WithdrawalDate, _ := time.Parse("2006-01-02", *request.WithdrawalDate)
		updates.WithdrawalDate = &WithdrawalDate
	} else {
		updates.WithdrawalDate = nil
	}

	if err := tx.Model(&student).
		Select("first_name", "last_name", "status", "suspension_start_date", "suspension_end_date", "withdrawal_date").
		Updates(updates).Error; err != nil {
		tx.Rollback()
		log.Printf("Update error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "受講生の更新に失敗しました"})
		return
	}

	// TeamIDが提供された場合、TeamStudentを更新または作成
	if request.TeamID != nil {
		var teamStudent models.TeamStudent
		err := tx.Where("student_id = ?", student.ID).First(&teamStudent).Error

		if err == gorm.ErrRecordNotFound {
			// 存在しない場合、新しいTeamStudentを作成
			teamStudent = models.TeamStudent{
				StudentID: student.ID,
				TeamID:    *request.TeamID,
			}
			if err := tx.Create(&teamStudent).Error; err != nil {
				tx.Rollback()
				log.Println("Error occurred:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "TeamStudentの作成に失敗しました"})
				return
			}
		} else if err == nil {
			// 存在する場合、TeamIDを更新
			teamStudent.TeamID = *request.TeamID
			if err := tx.Save(&teamStudent).Error; err != nil {
				tx.Rollback()
				log.Println("Error occurred:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "TeamStudentの更新に失敗しました"})
				return
			}
		} else {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "TeamStudentの検索に失敗しました"})
			return
		}
	} else {
		log.Println(student.ID)
		// TeamIDが提供されていない場合、TeamStudentを削除
		if err := tx.Unscoped().Where("student_id = ?", student.ID).Delete(&models.TeamStudent{}).Error; err != nil {
			tx.Rollback()
			log.Println("Error occurred:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "TeamStudentの削除に失敗しました"})
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "トランザクションのコミットに失敗しました"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "受講生が正常に更新されました"})
}

type RegisterRequest struct {
	SeasonNumber uint           `json:"SeasonNumber"`
	Teams        []RegisterTeam `json:"Teams"`
}

type RegisterTeam struct {
	TeamName string            `json:"TeamName"`
	Students []RegisterStudent `json:"Students"`
}

type RegisterStudent struct {
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
}

func RegisterStudents(c *gin.Context) {
	var request RegisterRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {

		season := models.Season{
			Number: request.SeasonNumber,
		}
		if err := tx.Create(&season).Error; err != nil {
			return err
		}
		teams := []models.Team{}
		for _, team := range request.Teams {
			teams = append(teams, models.Team{
				Name: team.TeamName,
			})
		}
		if err := tx.Create(&teams).Error; err != nil {
			return err
		}
		seasonTeams := []models.SeasonTeam{}
		for _, team := range teams {
			seasonTeams = append(seasonTeams, models.SeasonTeam{
				SeasonID: season.ID,
				TeamID:   team.ID,
			})
		}
		if err := tx.Create(&seasonTeams).Error; err != nil {
			return err
		}

		students := []models.Student{}
		studentTeams := []models.TeamStudent{}
		for i, reqTeam := range request.Teams {
			for _, student := range reqTeam.Students {
				newStudent := models.Student{
					FirstName: student.FirstName,
					LastName:  student.LastName,
					Email:     fmt.Sprintf("%s.%s@example.com", student.FirstName, student.LastName),
					Status:    "受講中",
				}
				students = append(students, newStudent)
				studentTeams = append(studentTeams, models.TeamStudent{
					TeamID: teams[i].ID,
				})
			}
		}
		if err := tx.Create(&students).Error; err != nil {
			return err
		}

		// 作成したStudentのIDをTeamStudentに設定
		for i, student := range students {
			studentTeams[i].StudentID = student.ID
		}
		if err := tx.Create(&studentTeams).Error; err != nil {
			return err
		}

		var tasks []models.Task
		if err := tx.Find(&tasks).Error; err != nil {
			return err
		}
		taskProgresses := []models.TaskProgress{}
		for _, task := range tasks {
			for _, student := range students {
				taskProgresses = append(taskProgresses, models.TaskProgress{
					TaskID:    task.ID,
					StudentID: student.ID,
					Status:    "未着手",
				})
			}
		}
		if err := tx.Create(&taskProgresses).Error; err != nil {
			return err
		}

		var genres []models.Genre
		if err := tx.Find(&genres).Error; err != nil {
			return err
		}
		genrePublications := []models.GenrePublication{}
		for i, genre := range genres {
			for _, team := range teams {
				genrePublications = append(genrePublications, models.GenrePublication{
					GenreID:     genre.ID,
					SeasonID:    season.ID,
					TeamID:      team.ID,
					IsPublished: i == 0,
				})
			}
		}
		if err := tx.Create(&genrePublications).Error; err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Students registered successfully"})
}

func GetStatusChangeRequestByStudentID(c *gin.Context) {
	studentID := c.Param("id")
	var response models.StudentStatusChangeRequest

	result := database.DB.Where("student_id = ? AND status = ?", studentID, "未対応").Find(&response)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusOK, gin.H{"data": nil})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}
