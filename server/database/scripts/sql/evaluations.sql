DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'evaluation_criteria') THEN
        CREATE TYPE evaluation_criteria AS ENUM 
        (
          'COOPERATION', 'CONCEPTUAL CONTRIBUTION', 'PRACTICAL CONTRIBUTION', 'WORK ETHIC'
        );
    END IF;
END$$;

CREATE OR REPLACE FUNCTION are_in_same_team (_user1_id INTEGER, _user2_id INTEGER, _team_id INTEGER) RETURNS BOOLEAN 
LANGUAGE plpgsql
AS
$$
    DECLARE
        team_count INTEGER;
    BEGIN
        SELECT count(user_id) 
            INTO team_count 
            FROM team_members
            WHERE (user_id = _user1_id
              OR user_id = _user2_id)
              AND team_id = _team_id;
        RETURN team_count = 2;
    END;
$$;

CREATE TABLE IF NOT EXISTS evaluations 
(
  evaluation_id   SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL,
  evaluator_id INTEGER NOT NULL,
  evaluatee_id INTEGER NOT NULL,
  FOREIGN KEY(team_id) REFERENCES teams(team_id)
      ON DELETE CASCADE,
  FOREIGN KEY(evaluator_id) REFERENCES users(user_id)
      ON DELETE CASCADE,
  FOREIGN KEY(evaluatee_id) REFERENCES users(user_id)
      ON DELETE CASCADE,
  UNIQUE(team_id,evaluator_id,evaluatee_id),
  CONSTRAINT are_in_same_team CHECK(are_in_same_team(evaluator_id,evaluatee_id,team_id)),
  CONSTRAINT is_student CHECK(NOT(is_instructor(evaluator_id) OR is_instructor(evaluatee_id))),
  CONSTRAINT no_self_review CHECK(NOT(evaluator_id = evaluatee_id))
);

CREATE TABLE IF NOT EXISTS evaluation_details
(
  evaluation_id INTEGER NOT NULL,
  criteria evaluation_criteria NOT NULL,
  rating INTEGER NOT NULL,
  comment VARCHAR(250),
  FOREIGN KEY(evaluation_id) REFERENCES evaluations(evaluation_id)
      ON DELETE CASCADE,
  PRIMARY KEY (evaluation_id, criteria),
  CONSTRAINT five_start_rating CHECK(rating <= 5 AND rating >= 0)
)