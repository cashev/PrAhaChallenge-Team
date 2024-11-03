package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
)

type TaskResponse struct {
	ID                uint   `json:"ID"`
	GenreID           uint   `json:"GenreID"`
	GenreName         string `json:"GenreName"`
	GenreDisplayOrder int    `json:"GenreDisplayOrder"`
	Title             string `json:"Title"`
	Text              string `json:"Text"`
	DisplayOrder      int    `json:"DisplayOrder"`
}

func GetTasks(c *gin.Context) {
	var tasks []models.Task

	if err := database.DB.Preload("GenreTasks.Genre").Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var taskResponses []TaskResponse
	for _, task := range tasks {
		var genreID uint
		var genreName string
		var genreDisplayOrder int
		if len(task.GenreTasks) > 0 {
			genreID = task.GenreTasks[0].Genre.ID
			genreName = task.GenreTasks[0].Genre.Name
			genreDisplayOrder = task.GenreTasks[0].Genre.DisplayOrder
		}
		taskResponses = append(taskResponses, TaskResponse{
			ID:                task.ID,
			GenreID:           genreID,
			GenreName:         genreName,
			GenreDisplayOrder: genreDisplayOrder,
			Title:             task.Title,
			Text:              task.Text,
			DisplayOrder:      task.DisplayOrder,
		})
	}

	c.JSON(http.StatusOK, gin.H{"tasks": taskResponses})
}

func GetTask(c *gin.Context) {
	taskId := c.Param("id")

	var task models.Task
	if err := database.DB.Preload("GenreTasks.Genre").First(&task, taskId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	var genreID uint
	var genreName string
	if len(task.GenreTasks) > 0 {
		genreID = task.GenreTasks[0].Genre.ID
		genreName = task.GenreTasks[0].Genre.Name
	}

	taskResponse := TaskResponse{
		ID:           task.ID,
		GenreID:      genreID,
		GenreName:    genreName,
		Title:        task.Title,
		Text:         task.Text,
		DisplayOrder: task.DisplayOrder,
	}

	c.JSON(http.StatusOK, gin.H{"task": taskResponse})
}

type createTaskRequest struct {
	Title   string `json:"Title" binding:"required"`
	Text    string `json:"Text" binding:"required"`
	GenreID uint   `json:"GenreID" binding:"required"`
}

func CreateTask(c *gin.Context) {
	var request createTaskRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 同じジャンルの課題の最大DisplayOrderを取得
	var maxDisplayOrder int
	if err := database.DB.Model(&models.Task{}).
		Joins("JOIN genre_tasks ON tasks.id = genre_tasks.task_id").
		Where("genre_tasks.genre_id = ?", request.GenreID).
		Select("COALESCE(MAX(tasks.display_order), 0)").
		Scan(&maxDisplayOrder).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	task := models.Task{
		Title:        request.Title,
		Text:         request.Text,
		DisplayOrder: maxDisplayOrder + 1,
	}

	if err := database.DB.Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	genreTask := models.GenreTask{
		TaskID:  task.ID,
		GenreID: request.GenreID,
	}
	if err := database.DB.Create(&genreTask).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "タスクが正常に作成されました"})
}

type updateTaskRequest struct {
	Title   string `json:"Title" binding:"required"`
	Text    string `json:"Text" binding:"required"`
	GenreID uint   `json:"GenreID" binding:"required"`
}

func UpdateTask(c *gin.Context) {
	var request updateTaskRequest
	id := c.Param("id")

	var task models.Task
	if err := database.DB.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// タスクの更新
	if err := database.DB.Model(&task).Updates(models.Task{
		Title: request.Title,
		Text:  request.Text,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ジャンルタスクの更新
	if err := database.DB.Model(&models.GenreTask{}).Where("task_id = ?", task.ID).Update("genre_id", request.GenreID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "タスクが正常に更新されました"})
}

func DeleteTask(c *gin.Context) {
	var task models.Task
	id := c.Param("id")

	if err := database.DB.Preload("GenreTasks").First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "タスクが見つかりません"})
		return
	}

	if err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&task.GenreTasks).Error; err != nil {
			return err
		}
		if err := tx.Delete(&task).Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "タスクの削除中にエラーが発生しました"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "タスクが正常に削除されました"})
}

type TaskOrderRequest struct {
	TaskID   uint `json:"TaskID" binding:"required"`
	NewOrder int  `json:"NewOrder" binding:"required"`
}

func UpdateTaskOrders(c *gin.Context) {
	var request []TaskOrderRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx := database.DB.Begin()
	for _, req := range request {
		// DisplayOrderのみを更新
		if err := tx.Model(&models.Task{}).
			Where("id = ?", req.TaskID).
			Update("display_order", req.NewOrder).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "タスクの順番が正常に更新されました"})
}

type TaskByStudentResponse struct {
	ID                uint   `json:"ID"`
	Title             string `json:"Title"`
	GenreID           uint   `json:"GenreID"`
	GenreName         string `json:"GenreName"`
	GenreDisplayOrder int    `json:"GenreDisplayOrder"`
	DisplayOrder      int    `json:"DisplayOrder"`
	Text              string `json:"Text"`
}

func GetTasksByStudent(c *gin.Context) {
	studentID, exists := c.Get("studentID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "学生IDが見つかりません"})
		return
	}

	// 学生のチーム情報とシーズン情報を取得
	var teamStudent models.TeamStudent
	if err := database.DB.
		Preload("Team.SeasonTeams.Season.SeasonTeams").
		Where("student_id = ?", studentID).
		First(&teamStudent).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "チーム情報が見つかりません"})
		return
	}

	if len(teamStudent.Team.SeasonTeams) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "シーズン情報が見つかりません"})
		return
	}

	teamIDs := []uint{}
	for _, st := range teamStudent.Team.SeasonTeams[0].Season.SeasonTeams {
		teamIDs = append(teamIDs, st.TeamID)
	}

	type TaskInfo struct {
		TaskID            uint
		TaskTitle         string
		TaskText          string
		TaskDisplayOrder  int
		GenreID           uint
		GenreName         string
		GenreDisplayOrder int
		TeamID            uint
		IsPublished       bool
	}

	var taskInfos []TaskInfo
	if err := database.DB.Table("tasks").
		Distinct("tasks.id as task_id, tasks.title as task_title, tasks.text as task_text, "+
			"tasks.display_order as task_display_order, "+
			"genres.id as genre_id, genres.name as genre_name, genres.display_order as genre_display_order, "+
			"gp1.team_id, gp1.is_published").
		Joins("JOIN genre_tasks ON tasks.id = genre_tasks.task_id").
		Joins("JOIN genres ON genre_tasks.genre_id = genres.id").
		Joins("JOIN genre_publications gp1 ON genres.id = gp1.genre_id").
		Joins("JOIN genre_publications gp2 ON genres.id = gp2.genre_id").
		Where("gp1.team_id = ?", teamStudent.TeamID).
		Where("gp2.team_id IN ? AND gp2.is_published = ?", teamIDs, true).
		Order("genres.display_order, tasks.display_order").
		Find(&taskInfos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "課題情報の取得に失敗しました"})
		return
	}

	// レスポンスの構築
	tasks := []TaskByStudentResponse{}
	for _, info := range taskInfos {
		task := TaskByStudentResponse{
			ID:                info.TaskID,
			Title:             info.TaskTitle,
			GenreID:           info.GenreID,
			GenreName:         info.GenreName,
			GenreDisplayOrder: info.GenreDisplayOrder,
			DisplayOrder:      info.TaskDisplayOrder,
		}
		if info.TeamID == teamStudent.TeamID && info.IsPublished {
			task.Text = info.TaskText
		}
		tasks = append(tasks, task)
	}

	c.JSON(http.StatusOK, gin.H{"tasks": tasks})
}
