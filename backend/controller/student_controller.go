package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
	"github.com/cashev/PrAhaChallenge-Team/backend/util"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type StudentList struct {
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
	Students   []StudentList `json:"students"`
	TotalCount int64         `json:"totalCount"`
}

type StudentInfoResponse struct {
	StudentID uint   `json:"StudentID"`
	SeasonID  uint   `json:"SeasonID"`
	Season    uint   `json:"Season"`
	TeamID    uint   `json:"TeamID"`
	TeamName  string `json:"TeamName"`
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
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
	var studentList []StudentList
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
			"students":   []StudentList{},
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

	if result.Error == nil && len(student.TeamStudents) > 0 {
		studentInfo = StudentInfoResponse{
			StudentID: student.ID,
			FirstName: student.FirstName,
			LastName:  student.LastName,
			TeamID:    student.TeamStudents[0].Team.ID,
			TeamName:  student.TeamStudents[0].Team.Name,
			SeasonID:  student.TeamStudents[0].Team.SeasonTeams[0].Season.ID,
			Season:    uint(student.TeamStudents[0].Team.SeasonTeams[0].Season.Number),
		}
	}

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch student info"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
		return
	}

	c.JSON(http.StatusOK, studentInfo)
}
