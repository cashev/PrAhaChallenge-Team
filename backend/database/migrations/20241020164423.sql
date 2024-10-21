-- Create "genres" table
CREATE TABLE "genres" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "name" character varying(100) NOT NULL,
  "display_order" bigint NOT NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_genres_deleted_at" to table: "genres"
CREATE INDEX "idx_genres_deleted_at" ON "genres" ("deleted_at");
-- Modify "tasks" table
ALTER TABLE "tasks" DROP COLUMN "task_genre_id", ADD COLUMN "display_order" bigint NOT NULL DEFAULT 0;
-- Create "genre_tasks" table
CREATE TABLE "genre_tasks" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "genre_id" bigint NOT NULL,
  "task_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_genre_tasks_genre" FOREIGN KEY ("genre_id") REFERENCES "genres" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_tasks_genre_tasks" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_genre_task" to table: "genre_tasks"
CREATE UNIQUE INDEX "idx_genre_task" ON "genre_tasks" ("genre_id", "task_id");
-- Create index "idx_genre_tasks_deleted_at" to table: "genre_tasks"
CREATE INDEX "idx_genre_tasks_deleted_at" ON "genre_tasks" ("deleted_at");
-- Create "seasons" table
CREATE TABLE "seasons" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "number" bigint NOT NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_seasons_deleted_at" to table: "seasons"
CREATE INDEX "idx_seasons_deleted_at" ON "seasons" ("deleted_at");
-- Create "teams" table
CREATE TABLE "teams" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "name" character varying(255) NOT NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_teams_deleted_at" to table: "teams"
CREATE INDEX "idx_teams_deleted_at" ON "teams" ("deleted_at");
-- Create "season_teams" table
CREATE TABLE "season_teams" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "season_id" bigint NOT NULL,
  "team_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_season_teams_season" FOREIGN KEY ("season_id") REFERENCES "seasons" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_season_teams_team" FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_season_team" to table: "season_teams"
CREATE UNIQUE INDEX "idx_season_team" ON "season_teams" ("season_id", "team_id");
-- Create index "idx_season_teams_deleted_at" to table: "season_teams"
CREATE INDEX "idx_season_teams_deleted_at" ON "season_teams" ("deleted_at");
-- Create "students" table
CREATE TABLE "students" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "first_name" character varying(255) NOT NULL,
  "last_name" character varying(255) NOT NULL,
  "status" text NOT NULL,
  "suspension_start_date" timestamptz NULL,
  "suspension_end_date" timestamptz NULL,
  "withdrawal_date" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_students_deleted_at" to table: "students"
CREATE INDEX "idx_students_deleted_at" ON "students" ("deleted_at");
-- Create "task_progresses" table
CREATE TABLE "task_progresses" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "student_id" bigint NOT NULL,
  "task_id" bigint NOT NULL,
  "status" character varying(20) NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_task_progresses_student" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_task_progresses_task" FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_task_progress" to table: "task_progresses"
CREATE UNIQUE INDEX "idx_task_progress" ON "task_progresses" ("student_id", "task_id");
-- Create index "idx_task_progresses_deleted_at" to table: "task_progresses"
CREATE INDEX "idx_task_progresses_deleted_at" ON "task_progresses" ("deleted_at");
-- Create "task_publications" table
CREATE TABLE "task_publications" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "genre_id" bigint NOT NULL,
  "season_id" bigint NOT NULL,
  "team_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_task_publications_genre" FOREIGN KEY ("genre_id") REFERENCES "genres" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_task_publications_season" FOREIGN KEY ("season_id") REFERENCES "seasons" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_task_publications_team" FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_task_publication" to table: "task_publications"
CREATE UNIQUE INDEX "idx_task_publication" ON "task_publications" ("genre_id", "season_id", "team_id");
-- Create index "idx_task_publications_deleted_at" to table: "task_publications"
CREATE INDEX "idx_task_publications_deleted_at" ON "task_publications" ("deleted_at");
-- Create "team_students" table
CREATE TABLE "team_students" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "student_id" bigint NOT NULL,
  "team_id" bigint NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_team_students_student" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_team_students_team" FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_team_student" to table: "team_students"
CREATE UNIQUE INDEX "idx_team_student" ON "team_students" ("student_id", "team_id");
-- Create index "idx_team_students_deleted_at" to table: "team_students"
CREATE INDEX "idx_team_students_deleted_at" ON "team_students" ("deleted_at");
-- Drop "task_genres" table
DROP TABLE "task_genres";
