-- Create "task_genres" table
CREATE TABLE "task_genres" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "genre_name" character varying(100) NOT NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_task_genres_deleted_at" to table: "task_genres"
CREATE INDEX "idx_task_genres_deleted_at" ON "task_genres" ("deleted_at");
-- Create "tasks" table
CREATE TABLE "tasks" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "title" character varying(255) NOT NULL,
  "task_genre_id" bigint NULL,
  "text" text NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_tasks_task_genre" FOREIGN KEY ("task_genre_id") REFERENCES "task_genres" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_tasks_deleted_at" to table: "tasks"
CREATE INDEX "idx_tasks_deleted_at" ON "tasks" ("deleted_at");
