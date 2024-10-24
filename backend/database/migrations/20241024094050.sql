-- Create "genre_publications" table
CREATE TABLE "genre_publications" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "genre_id" bigint NOT NULL,
  "season_id" bigint NOT NULL,
  "team_id" bigint NOT NULL,
  "is_published" boolean NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_genre_publications_genre" FOREIGN KEY ("genre_id") REFERENCES "genres" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_genre_publications_season" FOREIGN KEY ("season_id") REFERENCES "seasons" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_genre_publications_team" FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_genre_publication" to table: "genre_publications"
CREATE UNIQUE INDEX "idx_genre_publication" ON "genre_publications" ("genre_id", "season_id", "team_id");
-- Create index "idx_genre_publications_deleted_at" to table: "genre_publications"
CREATE INDEX "idx_genre_publications_deleted_at" ON "genre_publications" ("deleted_at");
-- Drop "task_publications" table
DROP TABLE "task_publications";
