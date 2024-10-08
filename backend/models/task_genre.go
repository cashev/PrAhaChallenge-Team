package models

import "gorm.io/gorm"

type TaskGenre struct {
	gorm.Model
	ID        uint   `gorm:"primaryKey"`
	GenreName string `gorm:"type:varchar(100);not null"`
}
