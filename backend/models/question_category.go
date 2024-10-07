package models

import "gorm.io/gorm"

type QuestionCategory struct {
    gorm.Model
    ID   uint   `gorm:"primaryKey"`
    Name string `gorm:"type:varchar(100);not null"`
}
