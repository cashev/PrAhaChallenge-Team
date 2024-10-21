package models

import "gorm.io/gorm"

type TaskPublication struct {
	gorm.Model
	ID       uint   `gorm:"primaryKey"`
	GenreID  uint   `gorm:"not null;uniqueIndex:idx_task_publication"`
	SeasonID uint   `gorm:"not null;uniqueIndex:idx_task_publication"`
	TeamID   uint   `gorm:"not null;uniqueIndex:idx_task_publication"`
	Genre    Genre  `gorm:"foreignKey:GenreID"`
	Season   Season `gorm:"foreignKey:SeasonID"`
	Team     Team   `gorm:"foreignKey:TeamID"`
}
