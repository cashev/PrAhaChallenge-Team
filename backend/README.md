# バックエンド

## セットアップ

```sh
go mod download

# atlasのインストール
curl -sSf https://atlasgo.sh | sh
```

## migrationファイルを適用する

```sh
make migrate
```

## modelsを変更する

migrationファイルを作成する

```sh
make migrate-diff
```
