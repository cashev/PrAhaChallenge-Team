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

func CreateTaskGenre(c *gin.Context) {
	var taskGenre models.TaskGenre

	if err := c.ShouldBind(&taskGenre); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := database.DB.Create(&taskGenre).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"taskGenre": taskGenre})
}
