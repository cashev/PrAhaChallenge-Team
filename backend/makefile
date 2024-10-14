.PHONY: run test test-integration migrate

run:
	go run main.go

# test:
#   go test -v ./...

# test-integration:
# 	go test -v ./... -tags=integration

migrate:
	atlas migrate apply --env gorm --url "$(DATABASE_URL)?search_path=public&sslmode=$(DATABASE_SSLMODE)"
