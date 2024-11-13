package main

import (
	"os"

	"github.com/cashev/PrAhaChallenge-Team/backend/auth/handler"
	"github.com/cashev/PrAhaChallenge-Team/backend/auth/middleware"
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

	r.POST("/login-as-student", handler.LoginAsStudent)

	r.GET("/students/:id", controller.GetStudentInfo)

	r.GET("/tasks", controller.GetTasks)
	r.POST("/tasks", controller.CreateTask)
	r.GET("/tasks/:id", controller.GetTask)
	r.PATCH("/tasks/:id", controller.UpdateTask)
	r.DELETE("/tasks/:id", controller.DeleteTask)
	r.PATCH("/tasks/order", controller.UpdateTaskOrders)

	r.GET("/genres", controller.GetGenres)
	r.POST("/genres", controller.CreateGenre)
	r.GET("/genres/:id", controller.GetGenre)
	r.PATCH("/genres/:id", controller.UpdateGenre)
	r.DELETE("/genres/:id", controller.DeleteGenre)
	r.PATCH("/genres/order", controller.UpdateGenreOrders)

	r.GET("/genre-publications", controller.GetGenrePublications)
	r.PATCH("/genre-publications", controller.UpdateGenrePublications)

	r.GET("/progress/:season", controller.GetTasksAndProgressBySeason)

	r.GET("/seasons", controller.GetSeasons)

	r.GET("/status-change-requests/:id", controller.GetStatusChangeRequest)
	r.GET("/status-change-requests/unprocessed", controller.GetUnprocessedStatusChangeRequests)
	r.GET("/status-change-requests/processed", controller.GetProcessedStatusChangeRequests)
	r.POST("/status-change-requests/process", controller.ProcessStatusChange)

	authorized := r.Group("/")
	authorized.Use(middleware.AuthStudentMiddleware())
	{
		authorized.GET("/student/tasks", controller.GetTasksAndProgressByStudent)
		authorized.POST("/student/progress", controller.UpdateTaskProgress)

		authorized.POST("/student/status-change-request", controller.SubmitStatusChange)
	}

	return r
}

func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return port
}
