package controller

import (
	"net/http"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type GenrePublicationResponse struct {
	GenrePublication []GenrePublication `json:"Genres"`
	Seasons          []season           `json:"Seasons"`
}

type GenrePublication struct {
	GenreID      uint         `json:"GenreID"`
	GenreName    string       `json:"GenreName"`
	DisplayOrder int          `json:"DisplayOrder"`
	SeasonTeams  []seasonTeam `json:"SeasonTeams"`
}

type seasonTeam struct {
	ID    uint                    `json:"ID"`
	Teams []teamPublicationStatus `json:"Teams"`
}

type teamPublicationStatus struct {
	ID          uint `json:"ID"`
	IsPublished bool `json:"IsPublished"`
}

type season struct {
	ID     uint   `json:"ID"`
	Number uint   `json:"Number"`
	Teams  []team `json:"Teams"`
}

type team struct {
	ID   uint   `json:"ID"`
	Name string `json:"Name"`
}

func GetGenrePublications(c *gin.Context) {
	var genrePublications []models.GenrePublication

	// データベースからジャンル公開情報を取得
	err := database.DB.Preload("Genre").Preload("Season").Preload("Team").Find(&genrePublications).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "データの取得に失敗しました"})
		return
	}

	// ジャンルごとにレスポンスを構築
	genreMap := make(map[uint]GenrePublication)
	seasonMap := make(map[uint]season)

	for _, pub := range genrePublications {
		// ジャンルをマッピング
		if _, exists := genreMap[pub.GenreID]; !exists {
			genreMap[pub.GenreID] = GenrePublication{
				GenreID:      pub.Genre.ID,
				GenreName:    pub.Genre.Name,
				DisplayOrder: pub.Genre.DisplayOrder,
				SeasonTeams:  []seasonTeam{},
			}
		}

		// シーズンを取得または作成
		genreResp := genreMap[pub.GenreID]
		var seasonTeamResp *seasonTeam
		for i := range genreResp.SeasonTeams {
			if genreResp.SeasonTeams[i].ID == pub.SeasonID {
				seasonTeamResp = &genreResp.SeasonTeams[i]
				break
			}
		}
		if seasonTeamResp == nil {
			seasonTeamResp = &seasonTeam{
				ID:    pub.Season.ID,
				Teams: []teamPublicationStatus{},
			}
			genreResp.SeasonTeams = append(genreResp.SeasonTeams, *seasonTeamResp)
		}

		// チームを追加
		seasonTeamResp.Teams = append(seasonTeamResp.Teams, teamPublicationStatus{
			ID:          pub.Team.ID,
			IsPublished: pub.IsPublished,
		})

		// 更新されたシーズンチームをマップに戻す
		for i := range genreResp.SeasonTeams {
			if genreResp.SeasonTeams[i].ID == seasonTeamResp.ID {
				genreResp.SeasonTeams[i] = *seasonTeamResp
				break
			}
		}
		genreMap[pub.GenreID] = genreResp

		// シーズン情報を更新
		if _, exists := seasonMap[pub.SeasonID]; !exists {
			seasonMap[pub.SeasonID] = season{
				ID:     pub.Season.ID,
				Number: pub.Season.Number,
				Teams:  []team{},
			}
		}
		seasonResp := seasonMap[pub.SeasonID]
		teamExists := false
		for _, existingTeam := range seasonResp.Teams {
			if existingTeam.ID == pub.Team.ID {
				teamExists = true
				break
			}
		}
		if !teamExists {
			seasonResp.Teams = append(seasonResp.Teams, team{
				ID:   pub.Team.ID,
				Name: pub.Team.Name,
			})
			seasonMap[pub.SeasonID] = seasonResp
		}
	}

	// マップからスライスに変換
	var genreResponse []GenrePublication
	for _, g := range genreMap {
		genreResponse = append(genreResponse, g)
	}

	var seasonResponse []season
	for _, s := range seasonMap {
		seasonResponse = append(seasonResponse, s)
	}

	response := GenrePublicationResponse{
		GenrePublication: genreResponse,
		Seasons:          seasonResponse,
	}

	c.JSON(http.StatusOK, gin.H{"genrePublications": response})
}

type UpdateGenrePublicationRequest struct {
	GenreID     uint `json:"GenreID"`
	SeasonID    uint `json:"SeasonID"`
	TeamID      uint `json:"TeamID"`
	IsPublished bool `json:"IsPublished"`
}

func UpdateGenrePublications(c *gin.Context) {
	var request []UpdateGenrePublicationRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		for _, req := range request {
			err := tx.Model(&models.GenrePublication{}).Where("genre_id = ? AND season_id = ? AND team_id = ?", req.GenreID, req.SeasonID, req.TeamID).Update("is_published", req.IsPublished).Error
			if err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ジャンルの公開状態の更新に失敗しました"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ジャンルの公開状態を更新しました"})
}
