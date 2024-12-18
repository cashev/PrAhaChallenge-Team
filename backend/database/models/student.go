package models

import (
	"time"

	"gorm.io/gorm"
)

type Student struct {
	gorm.Model
	ID                  uint   `gorm:"primaryKey"`
	FirstName           string `gorm:"type:varchar(255);not null"`
	LastName            string `gorm:"type:varchar(255);not null"`
	Email               string `gorm:"type:varchar(255);not null;unique"`
	Status              string `gorm:"not null"`
	SuspensionStartDate *time.Time
	SuspensionEndDate   *time.Time
	WithdrawalDate      *time.Time
	TeamStudents        []TeamStudent `gorm:"foreignKey:StudentID"`
}
