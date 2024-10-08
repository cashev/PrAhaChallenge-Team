package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/models"
)

func GetQuestions(c *gin.Context) {
	var questions []models.Question

	if err := database.DB.Preload("Category").Find(&questions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"questions": questions})
}

func CreateQuestion(c *gin.Context) {
	var question models.Question

	if err := c.ShouldBind(&question); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := database.DB.Create(&question).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"question": question})
}
