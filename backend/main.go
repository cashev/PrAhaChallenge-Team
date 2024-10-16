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
	port := getPort()
	r.Run(":" + port)
}

func setupDatabase() {
	database.Connect()
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.GET("/tasks", controller.GetTasks)
	r.GET("/tasks/:id", controller.GetTask)
	r.POST("/tasks", controller.CreateTask)
	r.POST("/tasks/update/:id", controller.UpdateTask)
	r.POST("/tasks/delete/:id", controller.DeleteTask)

	r.GET("/task_genres", controller.GetTaskGenres)
	r.GET("/task_genres/:id", controller.GetTaskGenre)
	r.POST("/task_genres", controller.CreateTaskGenre)
	r.POST("/task_genres/update/:id", controller.UpdateTaskGenre)
	r.POST("/task_genres/delete/:id", controller.DeleteTaskGenre)

	return r
}

func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return port
}
