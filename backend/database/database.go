package database

import (
	"fmt"
	"os"

	"github.com/lib/pq"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	url := os.Getenv("DATABASE_URL")
	if url == "" {
		panic("環増変数 DATABASE_URL が設定されていません")
	}
	connection, err := pq.ParseURL(url)
	if err != nil {
		panic("データベース接続情報の解析に失敗しました: " + err.Error())
	}
	dsn := fmt.Sprintf("%s sslmode=disable TimeZone=Asia/Tokyo", connection)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("データベース接続に失敗しました: " + err.Error())
	}

	DB = db
}
