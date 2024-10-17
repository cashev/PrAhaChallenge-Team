package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/models"
)

func GetTaskGenres(c *gin.Context) {
	var taskGenres []models.TaskGenre

	if err := database.DB.Find(&taskGenres).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"taskGenres": taskGenres})
}

func GetTaskGenre(c *gin.Context) {
	var taskGenre models.TaskGenre
	id := c.Param("id")

	if err := database.DB.First(&taskGenre, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"taskGenre": taskGenre})
}

type CreateTaskGenreRequest struct {
	GenreName string `json:"GenreName" binding:"required"`
}

func CreateTaskGenre(c *gin.Context) {
	var request CreateTaskGenreRequest

	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	taskGenre := models.TaskGenre{
		GenreName: request.GenreName,
	}
	if err := database.DB.Create(&taskGenre).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"taskGenre": taskGenre})
}

func UpdateTaskGenre(c *gin.Context) {
	var taskGenre models.TaskGenre
	id := c.Param("id")

	if err := database.DB.First(&taskGenre, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	if err := c.ShouldBind(&taskGenre); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := database.DB.Save(&taskGenre).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"taskGenre": taskGenre})
}

func DeleteTaskGenre(c *gin.Context) {
	var taskGenre models.TaskGenre
	id := c.Param("id")

	if err := database.DB.First(&taskGenre, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	if err := database.DB.Delete(&taskGenre).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"taskGenre": taskGenre})
}
