package models

import (
	"gorm.io/gorm"
)

type TaskProgress struct {
	gorm.Model
	ID        uint    `gorm:"primaryKey"`
	StudentID uint    `gorm:"not null;uniqueIndex:idx_task_progress"`
	TaskID    uint    `gorm:"not null;uniqueIndex:idx_task_progress"`
	Status    string  `gorm:"type:varchar(20);not null"`
	Student   Student `gorm:"foreignKey:StudentID"`
	Task      Task    `gorm:"foreignKey:TaskID"`
}
