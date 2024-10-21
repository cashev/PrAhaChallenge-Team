package models

import "gorm.io/gorm"

type Task struct {
	gorm.Model
	ID           uint        `gorm:"primaryKey"`
	Title        string      `gorm:"type:varchar(255);not null"`
	Text         string      `gorm:"type:text;not null"`
	DisplayOrder int         `gorm:"not null;default:0"`
	GenreTasks   []GenreTask `gorm:"foreignKey:TaskID"`
}
