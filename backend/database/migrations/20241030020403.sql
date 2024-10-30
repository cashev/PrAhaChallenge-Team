-- Modify "students" table
ALTER TABLE "students" ADD COLUMN "email" character varying(255) NULL, ADD CONSTRAINT "uni_students_email" UNIQUE ("email");
