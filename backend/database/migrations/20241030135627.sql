-- Modify "season_teams" table
ALTER TABLE "season_teams" DROP CONSTRAINT "fk_season_teams_season", DROP CONSTRAINT "fk_season_teams_team", ADD
 CONSTRAINT "fk_seasons_season_teams" FOREIGN KEY ("season_id") REFERENCES "seasons" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION, ADD
 CONSTRAINT "fk_teams_season_teams" FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
-- Modify "team_students" table
ALTER TABLE "team_students" DROP CONSTRAINT "fk_team_students_student", DROP CONSTRAINT "fk_team_students_team", ADD
 CONSTRAINT "fk_students_team_students" FOREIGN KEY ("student_id") REFERENCES "students" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION, ADD
 CONSTRAINT "fk_teams_team_students" FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION;
