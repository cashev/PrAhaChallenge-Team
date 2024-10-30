package controller

import (
	"net/http"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
	"github.com/gin-gonic/gin"
)

type StudentInfoResponse struct {
	StudentID uint   `json:"StudentID"`
	SeasonID  uint   `json:"SeasonID"`
	Season    uint   `json:"Season"`
	TeamID    uint   `json:"TeamID"`
	TeamName  string `json:"TeamName"`
	FirstName string `json:"FirstName"`
	LastName  string `json:"LastName"`
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
