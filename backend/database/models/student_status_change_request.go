package models

import (
	"time"

	"gorm.io/gorm"
)

type StudentStatusChangeRequest struct {
	gorm.Model
	ID               uint      `gorm:"primaryKey"`
	StudentID        uint      `gorm:"not null"`
	Type             string    `gorm:"not null"`
	RequestDate      time.Time `gorm:"not null"`
	Reason           string
	Status           string    `gorm:"not null"`
	SubmittedDate    time.Time `gorm:"not null"`
	ProcessedDate    time.Time
	SuspensionPeriod *uint
	Student          Student `gorm:"foreignKey:StudentID"`
}
