package models

import "gorm.io/gorm"

type Season struct {
	gorm.Model
	ID          uint         `gorm:"primaryKey"`
	Number      uint         `gorm:"not null"`
	SeasonTeams []SeasonTeam `gorm:"foreignKey:SeasonID"`
}
