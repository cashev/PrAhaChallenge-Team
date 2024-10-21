package models

import "gorm.io/gorm"

type TeamStudent struct {
	gorm.Model
	ID        uint    `gorm:"primaryKey"`
	StudentID uint    `gorm:"not null;uniqueIndex:idx_team_student"`
	TeamID    uint    `gorm:"not null;uniqueIndex:idx_team_student"`
	Team      Team    `gorm:"foreignKey:TeamID"`
	Student   Student `gorm:"foreignKey:StudentID"`
}
