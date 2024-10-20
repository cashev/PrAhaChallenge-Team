package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/models"
)

type GenreResponse struct {
	ID           uint   `json:"ID"`
	Name         string `json:"Name"`
	DisplayOrder int    `json:"DisplayOrder"`
}

type GenreWithRefResponse struct {
	GenreResponse
	IsReferenced bool `json:"IsReferenced"`
}

func GetGenres(c *gin.Context) {
	var genres []models.Genre
	if err := database.DB.Order("display_order").Find(&genres).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	genresResponse := make([]GenreWithRefResponse, 0)
	for _, genre := range genres {
		var count int64
		database.DB.Model(&models.Task{}).Where("id IN (SELECT task_id FROM genre_tasks WHERE genre_id = ?)", genre.ID).Count(&count)
		isReferenced := count > 0
		genresResponse = append(genresResponse, GenreWithRefResponse{
			GenreResponse: GenreResponse{
				ID:           genre.ID,
				Name:         genre.Name,
				DisplayOrder: genre.DisplayOrder,
			},
			IsReferenced: isReferenced,
		})
	}

	c.JSON(http.StatusOK, gin.H{"genres": genresResponse})
}

func GetGenre(c *gin.Context) {
	id := c.Param("id")

	var genre models.Genre
	if err := database.DB.First(&genre, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"genre": genre})
}

type CreateGenreRequest struct {
	Name         string `json:"Name" binding:"required"`
	DisplayOrder int    `json:"DisplayOrder" binding:"required"`
}

func CreateGenre(c *gin.Context) {
	var request CreateGenreRequest
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	genre := models.Genre{
		Name:         request.Name,
		DisplayOrder: request.DisplayOrder,
	}
	if err := database.DB.Create(&genre).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ジャンルが正常に作成されました"})
}

func UpdateGenre(c *gin.Context) {
	id := c.Param("id")

	var genre models.Genre
	if err := database.DB.First(&genre, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	var request CreateGenreRequest
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	genre.Name = request.Name
	genre.DisplayOrder = request.DisplayOrder

	if err := database.DB.Save(&genre).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ジャンルが正常に更新されました"})
}

func DeleteGenre(c *gin.Context) {
	id := c.Param("id")

	var genre models.Genre
	if err := database.DB.First(&genre, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ジャンルが見つかりません"})
		return
	}

	// GenreTaskテーブルでの参照をチェック
	var count int64
	if err := database.DB.Model(&models.GenreTask{}).Where("genre_id = ?", id).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "データベースエラーが発生しました"})
		return
	}
	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "このジャンルは課題で使用されているため削除できません"})
		return
	}

	if err := database.DB.Delete(&genre).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ジャンルの削除中にエラーが発生しました"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ジャンルが正常に削除されました"})
}
