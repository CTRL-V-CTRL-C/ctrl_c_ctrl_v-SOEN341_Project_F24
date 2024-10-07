CREATE TABLE IF NOT EXISTS courses 
(
  course_id   SERIAL PRIMARY KEY,
  course_name VARCHAR(32) UNIQUE NOT NULL,
  instructor_id INTEGER NOT NULL,
  FOREIGN KEY(instructor_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);