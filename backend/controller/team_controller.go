package controller

import (
	"net/http"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
	"github.com/gin-gonic/gin"
)

type GetTeamsResponse struct {
	ID   uint   `json:"ID"`
	Name string `json:"Name"`
}

func GetTeams(c *gin.Context) {
	var teams []models.Team
	if err := database.DB.Find(&teams).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := []GetTeamsResponse{}
	for _, team := range teams {
		response = append(response, GetTeamsResponse{ID: team.ID, Name: team.Name})
	}
	c.JSON(http.StatusOK, gin.H{"teams": response})
}
