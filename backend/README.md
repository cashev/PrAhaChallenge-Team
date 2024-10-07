# バックエンド

## セットアップ

```sh
go mod download

# atlasのインストール
curl -sSf https://atlasgo.sh | sh
```

## migrationファイルを適用する

```sh
atlas migrate apply \
  --env gorm \
  --url "postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?search_path=public&sslmode=disable"
```

## modelsを変更する

migrationファイルを作成する

```sh
atlas migrate diff --env gorm
```
