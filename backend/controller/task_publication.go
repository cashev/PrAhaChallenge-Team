package controller

import (
	"net/http"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/gin-gonic/gin"
)

type TaskPublicationResponse struct {
	GenreID      uint   `json:"GenreID"`
	GenreName    string `json:"GenreName"`
	SeasonID     uint   `json:"SeasonID"`
	SeasonNumber int    `json:"SeasonNumber"`
	TeamID       uint   `json:"TeamID"`
	TeamName     string `json:"TeamName"`
	IsPublished  bool   `json:"IsPublished"`
}

func GetTaskPublications(c *gin.Context) {
	var taskPublications []TaskPublicationResponse

	err := database.DB.Table("task_publications").
		Select("genres.id as genre_id, genres.name as genre_name, seasons.id as season_id, seasons.number as season_number, teams.id as team_id, teams.name as team_name, task_publications.is_published").
		Joins("JOIN genres ON task_publications.genre_id = genres.id").
		Joins("JOIN seasons ON task_publications.season_id = seasons.id").
		Joins("JOIN teams ON task_publications.team_id = teams.id").
		Scan(&taskPublications).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "データの取得に失敗しました"})
		return
	}

	c.JSON(http.StatusOK, taskPublications)
}
