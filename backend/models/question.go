package models

import "gorm.io/gorm"

type Question struct {
    gorm.Model
    ID         uint   `gorm:"primaryKey"`
    Title      string `gorm:"type:varchar(255);not null"`
    CategoryID uint
    Text       string `gorm:"type:text;not null"`
    Category   QuestionCategory `gorm:"foreignKey:CategoryID"`
}
