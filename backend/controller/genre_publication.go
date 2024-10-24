package controller

import (
	"net/http"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
	"github.com/gin-gonic/gin"
)

type GenrePublicationResponse struct {
	GenreID           uint   `json:"GenreID"`
	GenreName         string `json:"GenreName"`
	GenreDisplayOrder int    `json:"GenreDisplayOrder"`
	SeasonID          uint   `json:"SeasonID"`
	SeasonNumber      int    `json:"SeasonNumber"`
	TeamID            uint   `json:"TeamID"`
	TeamName          string `json:"TeamName"`
	IsPublished       bool   `json:"IsPublished"`
}

func GetGenrePublications(c *gin.Context) {
	var genrePublications []GenrePublicationResponse

	err := database.DB.Table("genre_publications").
		Select("genres.id as genre_id, genres.name as genre_name, genres.display_order as genre_display_order, seasons.id as season_id, seasons.number as season_number, teams.id as team_id, teams.name as team_name, genre_publications.is_published").
		Joins("JOIN genres ON genre_publications.genre_id = genres.id").
		Joins("JOIN seasons ON genre_publications.season_id = seasons.id").
		Joins("JOIN teams ON genre_publications.team_id = teams.id").
		Scan(&genrePublications).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "データの取得に失敗しました"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"genrePublications": genrePublications})
}

type UpdateGenrePublicationRequest struct {
	GenreID     uint `json:"GenreID"`
	SeasonID    uint `json:"SeasonID"`
	TeamID      uint `json:"TeamID"`
	IsPublished bool `json:"IsPublished"`
}

func UpdateGenrePublication(c *gin.Context) {
	var request UpdateGenrePublicationRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := database.DB.Model(&models.GenrePublication{}).Where("genre_id = ? AND season_id = ? AND team_id = ?", request.GenreID, request.SeasonID, request.TeamID).Update("is_published", request.IsPublished).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ジャンルの公開状態の更新に失敗しました"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ジャンルの公開状態を更新しました"})
}
