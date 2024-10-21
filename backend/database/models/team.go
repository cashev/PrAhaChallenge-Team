package models

import "gorm.io/gorm"

type Team struct {
	gorm.Model
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"type:varchar(255);not null"`
}
