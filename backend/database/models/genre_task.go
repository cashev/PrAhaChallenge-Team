package models

import "gorm.io/gorm"

type GenreTask struct {
	gorm.Model
	ID      uint  `gorm:"primaryKey"`
	GenreID uint  `gorm:"not null;uniqueIndex:idx_genre_task"`
	TaskID  uint  `gorm:"not null;uniqueIndex:idx_genre_task"`
	Genre   Genre `gorm:"foreignKey:GenreID"`
	Task    Task  `gorm:"foreignKey:TaskID"`
}
