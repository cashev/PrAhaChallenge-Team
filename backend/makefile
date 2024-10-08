.PHONY: run test test-integration migrate

run:
	go run main.go

# test:
#   go test -v ./...

# test-integration:
# 	go test -v ./... -tags=integration

migrate:
	atlas migrate apply --env gorm --url "postgres://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?search_path=public&sslmode=disable"
