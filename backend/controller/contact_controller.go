package controller

import (
	"log"
	"net/http"
	"time"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
	"github.com/gin-gonic/gin"
)

type StatusChangeRequestStatus string

const (
	StatusChangeRequestStatusUnprocessed StatusChangeRequestStatus = "未対応"
	StatusChangeRequestStatusProcessed   StatusChangeRequestStatus = "対応済"
)

type StatusChangeRequestType string

const (
	StatusChangeRequestTypeSuspension StatusChangeRequestType = "休会"
	StatusChangeRequestTypeLeave      StatusChangeRequestType = "退会"
)

type GetStatusChangeRequestResponse struct {
	ID               uint      `json:"ID"`
	SeasonID         uint      `json:"SeasonID"`
	Season           uint      `json:"Season"`
	TeamID           uint      `json:"TeamID"`
	TeamName         string    `json:"TeamName"`
	StudentID        uint      `json:"StudentID"`
	StudentName      string    `json:"StudentName"`
	Type             string    `json:"Type"`
	RequestDate      time.Time `json:"RequestDate"`
	Reason           string    `json:"Reason"`
	Status           string    `json:"Status"`
	SubmittedDate    time.Time `json:"SubmittedDate"`
	ProcessedDate    time.Time `json:"ProcessedDate"`
	SuspensionPeriod *uint     `json:"SuspensionPeriod"`
}

func GetStatusChangeRequest(c *gin.Context) {
	requestID := c.Param("id")

	var request models.StudentStatusChangeRequest
	if err := database.DB.
		Joins("Student").
		Preload("Student.TeamStudents.Team.SeasonTeams.Season").
		Where("student_status_change_requests.id = ?", requestID).First(&request).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := GetStatusChangeRequestResponse{
		ID:               request.ID,
		StudentID:        request.Student.ID,
		StudentName:      request.Student.FirstName + " " + request.Student.LastName,
		Type:             request.Type,
		Status:           request.Status,
		Reason:           request.Reason,
		RequestDate:      request.RequestDate,
		SubmittedDate:    request.SubmittedDate,
		ProcessedDate:    request.ProcessedDate,
		SuspensionPeriod: request.SuspensionPeriod,
	}

	// チームに所属している場合のみ、チーム情報を設定
	if len(request.Student.TeamStudents) > 0 {
		response.TeamID = request.Student.TeamStudents[0].Team.ID
		response.TeamName = request.Student.TeamStudents[0].Team.Name

		if len(request.Student.TeamStudents[0].Team.SeasonTeams) > 0 {
			response.SeasonID = request.Student.TeamStudents[0].Team.SeasonTeams[0].Season.ID
			response.Season = uint(request.Student.TeamStudents[0].Team.SeasonTeams[0].Season.Number)
		}
	}

	if !request.ProcessedDate.IsZero() {
		response.ProcessedDate = request.ProcessedDate
	}

	c.JSON(http.StatusOK, gin.H{"request": response})
}

type GetStatusChangeRequestsResponse struct {
	ID               uint      `json:"ID"`
	StudentID        uint      `json:"StudentID"`
	StudentName      string    `json:"StudentName"`
	Type             string    `json:"Type"`
	Status           string    `json:"Status"`
	Reason           string    `json:"Reason"`
	RequestDate      time.Time `json:"RequestDate"`
	SubmittedDate    time.Time `json:"SubmittedDate"`
	ProcessedDate    time.Time `json:"ProcessedDate"`
	SuspensionPeriod *uint     `json:"SuspensionPeriod"`
}

func GetUnprocessedStatusChangeRequests(c *gin.Context) {
	var requests []models.StudentStatusChangeRequest
	database.DB.
		Joins("Student").
		Where("student_status_change_requests.status = ?", string(StatusChangeRequestStatusUnprocessed)).Find(&requests)

	var response []GetStatusChangeRequestsResponse
	if len(requests) == 0 {
		c.JSON(http.StatusOK, gin.H{"requests": []GetStatusChangeRequestsResponse{}})
		return
	}
	for _, request := range requests {
		response = append(response, GetStatusChangeRequestsResponse{
			ID:               request.ID,
			StudentID:        request.Student.ID,
			StudentName:      request.Student.FirstName + " " + request.Student.LastName,
			Type:             request.Type,
			Status:           request.Status,
			Reason:           request.Reason,
			RequestDate:      request.RequestDate,
			SubmittedDate:    request.SubmittedDate,
			ProcessedDate:    request.ProcessedDate,
			SuspensionPeriod: request.SuspensionPeriod,
		})
	}
	c.JSON(http.StatusOK, gin.H{"requests": response})
}

func GetProcessedStatusChangeRequests(c *gin.Context) {
	var requests []models.StudentStatusChangeRequest
	database.DB.
		Joins("Student").
		Where("student_status_change_requests.status <> ?", string(StatusChangeRequestStatusUnprocessed)).Find(&requests)

	var response []GetStatusChangeRequestsResponse
	if len(requests) == 0 {
		c.JSON(http.StatusOK, gin.H{"requests": []GetStatusChangeRequestsResponse{}})
		return
	}
	for _, request := range requests {
		response = append(response, GetStatusChangeRequestsResponse{
			ID:               request.ID,
			StudentID:        request.Student.ID,
			StudentName:      request.Student.FirstName + " " + request.Student.LastName,
			Type:             request.Type,
			Status:           request.Status,
			Reason:           request.Reason,
			RequestDate:      request.RequestDate,
			SubmittedDate:    request.SubmittedDate,
			ProcessedDate:    request.ProcessedDate,
			SuspensionPeriod: request.SuspensionPeriod,
		})
	}
	c.JSON(http.StatusOK, gin.H{"requests": response})
}

type StatusChangeRequest struct {
	StudentID        uint      `json:"StudentID"`
	Type             string    `json:"Type"`
	Reason           string    `json:"Reason"`
	RequestDate      time.Time `json:"RequestDate"`
	SuspensionPeriod *uint     `json:"SuspensionPeriod"`
}

func SubmitStatusChange(c *gin.Context) {
	var request StatusChangeRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	studentStatusChangeRequest := models.StudentStatusChangeRequest{
		StudentID:        request.StudentID,
		Type:             request.Type,
		Reason:           request.Reason,
		RequestDate:      request.RequestDate,
		Status:           string(StatusChangeRequestStatusUnprocessed),
		SubmittedDate:    time.Now(),
		SuspensionPeriod: request.SuspensionPeriod,
	}

	if err := database.DB.Create(&studentStatusChangeRequest).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status change request submitted successfully"})
}

type ProcessedStatusChangeRequest struct {
	ID uint `json:"ID"`
}

func ProcessStatusChange(c *gin.Context) {
	var request ProcessedStatusChangeRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx := database.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "トランザクション開始エラー"})
		return
	}

	var studentStatusChangeRequest models.StudentStatusChangeRequest
	if err := tx.Where("id = ?", request.ID).First(&studentStatusChangeRequest).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// お問い合わせを対応済にする
	studentStatusChangeRequest.Status = string(StatusChangeRequestStatusProcessed)
	studentStatusChangeRequest.ProcessedDate = time.Now()
	if err := tx.Save(&studentStatusChangeRequest).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// 受講生のステータスを更新する
	updates := models.Student{}
	switch studentStatusChangeRequest.Type {
	case "休会":
		updates.Status = "休会中"
		updates.SuspensionStartDate = &studentStatusChangeRequest.RequestDate

		// 月数で終了日を計算
		suspensionEndDate := studentStatusChangeRequest.RequestDate.AddDate(0, int(*studentStatusChangeRequest.SuspensionPeriod), 0)
		suspensionEndDate = suspensionEndDate.AddDate(0, 0, -suspensionEndDate.Day())
		updates.SuspensionEndDate = &suspensionEndDate

	case "退会":
		updates.Status = "退会済"
		updates.WithdrawalDate = &studentStatusChangeRequest.RequestDate
	}

	if err := tx.Model(&models.Student{}).
		Where("id = ?", studentStatusChangeRequest.StudentID).
		Select("status", "suspension_start_date", "suspension_end_date", "withdrawal_date").
		Updates(updates).Error; err != nil {
		tx.Rollback()
		log.Printf("Update error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "受講生の更新に失敗しました"})
		return
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "トランザクションコミットエラー"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status change request processed successfully"})
}
