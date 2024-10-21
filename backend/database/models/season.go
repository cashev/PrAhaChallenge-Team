package models

import "gorm.io/gorm"

type Season struct {
	gorm.Model
	ID     uint `gorm:"primaryKey"`
	Number int  `gorm:"not null"`
}
