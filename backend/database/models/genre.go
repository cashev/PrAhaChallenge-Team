package models

import "gorm.io/gorm"

type Genre struct {
	gorm.Model
	ID           uint   `gorm:"primaryKey"`
	Name         string `gorm:"type:varchar(100);not null"`
	DisplayOrder int    `gorm:"not null"`
}
