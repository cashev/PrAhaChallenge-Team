package main

import (
	"github.com/cashev/PrAhaChallenge-Team/backend/controller"
	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/gin-gonic/gin"
)

func main() {
	setupDatabase()
	r := setupRouter()
	r.Run(":8080")
}

func setupDatabase() {
	database.Connect()
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.GET("/question_categories", controller.GetQuestionCategories)
	r.POST("/question_categories", controller.CreateQuestionCategory)

	r.GET("/questions", controller.GetQuestions)
	r.POST("/questions", controller.CreateQuestion)

	return r
}
