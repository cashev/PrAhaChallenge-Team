package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
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

type createGenreRequest struct {
	Name string `json:"Name" binding:"required"`
}

func CreateGenre(c *gin.Context) {
	var request createGenreRequest
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// トランザクションを開始
	tx := database.DB.Begin()

	// 最大のDisplayOrderを取得
	var maxDisplayOrder int
	if err := tx.Model(&models.Genre{}).Select("COALESCE(MAX(display_order), 0)").Scan(&maxDisplayOrder).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DisplayOrderの取得に失敗しました"})
		return
	}

	genre := models.Genre{
		Name:         request.Name,
		DisplayOrder: maxDisplayOrder + 1, // 最大値+1を設定
	}
	if err := tx.Create(&genre).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// SeasonTeamテーブルから全ての有効な組み合わせを取得
	var seasonTeams []models.SeasonTeam
	if err := tx.Find(&seasonTeams).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "SeasonTeamの取得に失敗しました"})
		return
	}

	// 各SeasonTeamに対してGenrePublicationを作成
	for _, seasonTeam := range seasonTeams {
		genrePublication := models.GenrePublication{
			GenreID:     genre.ID,
			SeasonID:    seasonTeam.SeasonID,
			TeamID:      seasonTeam.TeamID,
			IsPublished: false, // デフォルトでは非公開
		}
		if err := tx.Create(&genrePublication).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "GenrePublicationの作成に失敗しました"})
			return
		}
	}

	// トランザクションをコミット
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "トランザクションのコミットに失敗しました"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ジャンルとGenrePublicationが正常に作成されました"})
}

type updateGenreRequest struct {
	Name string `json:"Name" binding:"required"`
}

func UpdateGenre(c *gin.Context) {
	id := c.Param("id")

	var genre models.Genre
	if err := database.DB.First(&genre, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	var request updateGenreRequest
	if err := c.ShouldBind(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	genre.Name = request.Name

	if err := database.DB.Model(&genre).Updates(models.Genre{Name: request.Name}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ジャンルが正常に更新されました"})
}

func DeleteGenre(c *gin.Context) {
	id := c.Param("id")

	// トランザクションを開始
	tx := database.DB.Begin()

	var genre models.Genre
	if err := tx.First(&genre, id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "ジャンルが見つかりません"})
		return
	}

	// GenreTaskテーブルでの参照をチェック
	var count int64
	if err := tx.Model(&models.GenreTask{}).Where("genre_id = ?", id).Count(&count).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "データベースエラーが発生しました"})
		return
	}
	if count > 0 {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "このジャンルは課題で使用されているため削除できません"})
		return
	}

	// GenrePublicationを削除
	if err := tx.Where("genre_id = ?", id).Delete(&models.GenrePublication{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "GenrePublicationの削除中にエラーが発生しました"})
		return
	}

	// ジャンルを削除
	if err := tx.Delete(&genre).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ジャンルの削除中にエラーが発生しました"})
		return
	}

	// トランザクションをコミット
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "トランザクションのコミットに失敗しました"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ジャンルとGenrePublicationが正常に削除されました"})
}

type GenreOrderRequest struct {
	GenreID  uint `json:"GenreID" binding:"required"`
	NewOrder int  `json:"NewOrder" binding:"required"`
}

func UpdateGenreOrders(c *gin.Context) {
	var request []GenreOrderRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx := database.DB.Begin()
	for _, req := range request {
		if err := tx.Model(&models.Genre{}).
			Where("id = ?", req.GenreID).
			Update("display_order", req.NewOrder).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "トランザクションのコミットに失敗しました"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ジャンルの表示順が正常に更新されました"})
}
