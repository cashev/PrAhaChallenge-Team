package main

import (
	"os"

	"github.com/cashev/PrAhaChallenge-Team/backend/auth/handler"
	"github.com/cashev/PrAhaChallenge-Team/backend/auth/middleware"
	"github.com/cashev/PrAhaChallenge-Team/backend/controller"
	"github.com/cashev/PrAhaChallenge-Team/backend/database"
	"github.com/gin-contrib/cors"
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

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // 一時的に全てのオリジンを許可
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	r.POST("/login-as-student", handler.LoginAsStudent)

	r.GET("/students", controller.GetStudents)
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

	authorized := r.Group("/")
	authorized.Use(middleware.AuthStudentMiddleware())
	{
		authorized.GET("/student/tasks", controller.GetTasksByStudent)
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
