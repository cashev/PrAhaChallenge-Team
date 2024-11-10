-- Create "student_status_change_requests" table
CREATE TABLE "student_status_change_requests" (
  "id" bigserial NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "student_id" bigint NOT NULL,
  "type" text NOT NULL,
  "request_date" timestamptz NOT NULL,
  "reason" text NULL,
  "status" text NOT NULL,
  "submitted_date" timestamptz NOT NULL,
  "processed_date" timestamptz NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_student_status_change_requests_student" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_student_status_change_requests_deleted_at" to table: "student_status_change_requests"
CREATE INDEX "idx_student_status_change_requests_deleted_at" ON "student_status_change_requests" ("deleted_at");
