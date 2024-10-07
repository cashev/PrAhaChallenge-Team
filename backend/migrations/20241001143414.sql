-- Create "question_categories" table
CREATE TABLE "question_categories" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "name" character varying(100) NOT NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_question_categories_deleted_at" to table: "question_categories"
CREATE INDEX "idx_question_categories_deleted_at" ON "question_categories" ("deleted_at");
-- Create "questions" table
CREATE TABLE "questions" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "title" character varying(255) NOT NULL,
  "category_id" bigint NULL,
  "text" text NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_questions_category" FOREIGN KEY ("category_id") REFERENCES "question_categories" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_questions_deleted_at" to table: "questions"
CREATE INDEX "idx_questions_deleted_at" ON "questions" ("deleted_at");
