package controller

import (
	"net/http"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
	"github.com/gin-gonic/gin"
)

type GetSeasonsResponse struct {
	ID     uint `json:"ID"`
	Number uint `json:"Number"`
}

func GetSeasons(c *gin.Context) {
	var seasons []models.Season
	if err := database.DB.Find(&seasons).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := []GetSeasonsResponse{}
	for _, season := range seasons {
		response = append(response, GetSeasonsResponse{ID: season.ID, Number: season.Number})
	}
	c.JSON(http.StatusOK, gin.H{"seasons": response})
}

func GetNextSeasonNumber(c *gin.Context) {
	var seasons []models.Season
	if err := database.DB.Order("Number DESC").Find(&seasons).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	nextNumber := 1
	if len(seasons) > 0 {
		nextNumber = int(seasons[0].Number) + 1
	}
	c.JSON(http.StatusOK, gin.H{"nextNumber": nextNumber})
}
