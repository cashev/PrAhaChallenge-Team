package models

import "gorm.io/gorm"

type Task struct {
	gorm.Model
	ID          uint   `gorm:"primaryKey"`
	Title       string `gorm:"type:varchar(255);not null"`
	TaskGenreID uint
	Text        string    `gorm:"type:text;not null"`
	TaskGenre   TaskGenre `gorm:"foreignKey:TaskGenreID"`
}
