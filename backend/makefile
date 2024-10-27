.PHONY: run test test-integration migrate

run:
	go run main.go

# test:
#   go test -v ./...

# test-integration:
# 	go test -v ./... -tags=integration

migrate:
	atlas migrate apply --env gorm --url "$(DATABASE_URL)?search_path=public&sslmode=$(DATABASE_SSLMODE)"

sample-data:
	go run database/test_util/create_sample_data.go

migrate-diff:
	atlas migrate diff --env gorm
