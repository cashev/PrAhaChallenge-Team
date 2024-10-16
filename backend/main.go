package main

import (
	"os"

	"github.com/cashev/PrAhaChallenge-Team/backend/controller"
	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/gin-gonic/gin"
)

func main() {
	setupDatabase()
	r := setupRouter()
	port := os.Getenv("PORT")
	r.Run(":" + port)
}

func setupDatabase() {
	database.Connect()
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.GET("/tasks", controller.GetTasks)
	r.POST("/tasks", controller.CreateTask)

	r.GET("/task_genres", controller.GetTaskGenres)
	r.POST("/task_genres", controller.CreateTaskGenre)

	return r
}
