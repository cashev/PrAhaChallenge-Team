package models

import "gorm.io/gorm"

type SeasonTeam struct {
	gorm.Model
	ID       uint   `gorm:"primaryKey"`
	SeasonID uint   `gorm:"not null;uniqueIndex:idx_season_team"`
	TeamID   uint   `gorm:"not null;uniqueIndex:idx_season_team"`
	Season   Season `gorm:"foreignKey:SeasonID"`
	Team     Team   `gorm:"foreignKey:TeamID"`
}
