CREATE OR REPLACE FUNCTION is_not_in_course (_user_id INTEGER, _team_id INTEGER) RETURNS BOOLEAN 
LANGUAGE plpgsql
AS
$$
    DECLARE
        new_course_id INTEGER;
    BEGIN
        SELECT course_id 
        INTO new_course_id
        FROM teams
        WHERE team_id = _team_id;

        RETURN
            NOT EXISTS(
                SELECT user_id FROM team_members tm
                JOIN teams t ON tm.team_id = t.team_id
                WHERE user_id = _user_id
                AND course_id = new_course_id
            );
    END;
$$;

CREATE TABLE IF NOT EXISTS teams
(
    team_id   SERIAL PRIMARY KEY,
    team_name VARCHAR(32) NOT NULL,
    course_id INTEGER NOT NULL,
    FOREIGN KEY(course_id) REFERENCES courses(course_id)
        ON DELETE CASCADE,
    UNIQUE(team_name, course_id)
);

CREATE TABLE IF NOT EXISTS team_members
(
    user_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    FOREIGN KEY(team_id) REFERENCES teams(team_id)
        ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    UNIQUE(user_id,team_id),
    CONSTRAINT is_not_instructor CHECK(NOT(is_instructor(user_id))),
    CONSTRAINT is_not_in_course CHECK(is_not_in_course(user_id,team_id))
);