package controller

import (
	"net/http"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
	"github.com/gin-gonic/gin"
)

type GetTeamsResponse struct {
	ID           uint   `json:"ID"`
	Name         string `json:"Name"`
	SeasonNumber uint   `json:"SeasonNumber"`
}

func GetTeams(c *gin.Context) {
	var teams []models.Team
	if err := database.DB.Preload("SeasonTeams.Season").Find(&teams).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := []GetTeamsResponse{}
	for _, team := range teams {
		for _, seasonTeam := range team.SeasonTeams {
			response = append(response, GetTeamsResponse{
				ID:           team.ID,
				Name:         team.Name,
				SeasonNumber: seasonTeam.Season.Number,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"teams": response})
}
