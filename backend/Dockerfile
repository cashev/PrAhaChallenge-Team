FROM golang:1.23.1

# Atlasのインストール
RUN curl -sSf https://atlasgo.sh | sh

# アプリケーションのセットアップ
COPY . .
RUN go mod download

# マイグレーションの実行とアプリケーションの起動
CMD make migrate && make run
