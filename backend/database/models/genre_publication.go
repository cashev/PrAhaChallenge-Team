package models

import "gorm.io/gorm"

type GenrePublication struct {
	gorm.Model
	ID          uint   `gorm:"primaryKey"`
	GenreID     uint   `gorm:"not null;uniqueIndex:idx_genre_publication"`
	SeasonID    uint   `gorm:"not null;uniqueIndex:idx_genre_publication"`
	TeamID      uint   `gorm:"not null;uniqueIndex:idx_genre_publication"`
	Genre       Genre  `gorm:"foreignKey:GenreID"`
	Season      Season `gorm:"foreignKey:SeasonID"`
	Team        Team   `gorm:"foreignKey:TeamID"`
	IsPublished bool   `gorm:"not null"`
}
