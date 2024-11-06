package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
	"github.com/gin-gonic/gin"
)

type StudentResponses struct {
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

type StudentInfoResponse struct {
	StudentID uint   `json:"StudentID"`
	SeasonID  uint   `json:"SeasonID"`
	Season    uint   `json:"Season"`
	TeamID    uint   `json:"TeamID"`
	TeamName  string `json:"TeamName"`
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
}

func GetStudents(c *gin.Context) {
	var studentResponses []StudentResponses

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	lastName := c.DefaultQuery("lastName", "")
	firstName := c.DefaultQuery("firstName", "")
	seasonNumber, _ := strconv.Atoi(c.DefaultQuery("seasonNumber", ""))
	teamName := c.DefaultQuery("teamName", "")
	status := c.DefaultQuery("status", "")
	suspensionStartDate := c.DefaultQuery("suspensionStartDate", "")
	suspensionEndDate := c.DefaultQuery("suspensionEndDate", "")
	withdrawalDate := c.DefaultQuery("withdrawalDate", "")

	if page < 1 {
		page = 1
	}

	if pageSize < 1 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize

	query := database.DB.Table("students").
		Select("students.id, students.first_name, students.last_name, students.status, " +
			"students.suspension_start_date, students.suspension_end_date, students.withdrawal_date, " +
			"team_students.team_id, teams.name AS team_name, " +
			"season_teams.season_id, seasons.number AS season_number").
		Joins("LEFT JOIN  team_students ON team_students.student_id = students.id").
		Joins("LEFT JOIN  teams ON teams.id = team_students.team_id").
		Joins("LEFT JOIN  season_teams ON season_teams.team_id = team_students.team_id").
		Joins("LEFT JOIN seasons ON seasons.id = season_teams.season_id").
		Order("seasons.number ASC, students.id ASC")

	// フィルタ条件を追加
	if lastName != "" {
		query = query.Where("students.last_name ILIKE ?", "%"+lastName+"%")
	}
	if firstName != "" {
		query = query.Where("students.first_name ILIKE ?", "%"+firstName+"%")
	}
	if seasonNumber != 0 {
		query = query.Where("seasons.number = ?", seasonNumber)
	}
	if teamName != "" {
		query = query.Where("teams.name = ?", teamName)
	}
	if status != "" {
		query = query.Where("students.status = ?", status)
	}
	if suspensionStartDate != "" {
		query = query.Where("students.suspension_start_date::date = ?", suspensionStartDate)
	}
	if suspensionEndDate != "" {
		query = query.Where("students.suspension_end_date::date = ?", suspensionEndDate)
	}
	if withdrawalDate != "" {
		query = query.Where("students.withdrawal_date::date = ?", withdrawalDate)
	}

	query = query.Limit(pageSize).Offset(offset)

	if err := query.Scan(&studentResponses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch student data from the database.",
		})
		return
	}

	if len(studentResponses) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"students": []StudentResponses{},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"students": studentResponses})
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
