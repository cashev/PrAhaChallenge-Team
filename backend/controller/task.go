package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/models"
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

type TaskRequest struct {
	Title        string `json:"Title" binding:"required"`
	Text         string `json:"Text" binding:"required"`
	GenreID      uint   `json:"GenreID" binding:"required"`
	DisplayOrder int    `json:"DisplayOrder" binding:"required"`
}

func CreateTask(c *gin.Context) {
	var request TaskRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task := models.Task{
		Title:        request.Title,
		Text:         request.Text,
		DisplayOrder: request.DisplayOrder,
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

func UpdateTask(c *gin.Context) {
	var request TaskRequest
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

	task.Title = request.Title
	task.Text = request.Text
	task.DisplayOrder = request.DisplayOrder

	if err := database.DB.Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var genreTask models.GenreTask
	if err := database.DB.Where("task_id = ?", task.ID).First(&genreTask).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	genreTask.GenreID = request.GenreID
	if err := database.DB.Save(&genreTask).Error; err != nil {
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
