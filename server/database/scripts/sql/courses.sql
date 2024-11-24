CREATE OR REPLACE FUNCTION is_instructor (_user_id INTEGER) RETURNS BOOLEAN 
LANGUAGE plpgsql
AS
$$
    BEGIN
        RETURN
            EXISTS(
                SELECT user_id FROM users
                WHERE user_id = _user_id
                AND role = 'INST'
            );
    END;
$$;

CREATE TABLE IF NOT EXISTS courses 
(
  course_id   SERIAL PRIMARY KEY,
  course_name VARCHAR(32) UNIQUE NOT NULL,
  instructor_id INTEGER NOT NULL,
  are_evaluations_released BOOLEAN DEFAULT FALSE,
  FOREIGN KEY(instructor_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
  CONSTRAINT is_instructor CHECK(is_instructor(instructor_id))
);