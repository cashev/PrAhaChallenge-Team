package handler

import (
	"net/http"
	"os"
	"time"

	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/cashev/PrAhaChallenge-Team/backend/database/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type LoginAsStudentRequest struct {
	Email string `json:"Email" binding:"required,email"`
}

type LoginAsStudentResponse struct {
	Token     string `json:"Token"`
	StudentID uint   `json:"StudentID"`
	Name      string `json:"Name"`
}

type Claims struct {
	StudentID uint `json:"StudentID"`
	jwt.RegisteredClaims
}

func LoginAsStudent(c *gin.Context) {
	var request LoginAsStudentRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "メールアドレスの形式が正しくありません"})
		return
	}

	var student models.Student
	if err := database.DB.Where("email = ?", request.Email).First(&student).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "メールアドレスが見つかりません"})
		return
	}

	// JWTトークンの生成
	claims := Claims{
		StudentID: student.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		secretKey = "your-default-secret-key" // 開発環境用のデフォルトキー
	}

	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "トークンの生成に失敗しました"})
		return
	}

	response := LoginAsStudentResponse{
		Token:     tokenString,
		StudentID: student.ID,
		Name:      student.FirstName + " " + student.LastName,
	}

	c.JSON(http.StatusOK, response)
}
