CREATE TABLE IF NOT EXISTS documents
(
  document_id   SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  document_name VARCHAR(40) NOT NULL,
  document BYTEA NOT NULL,
  upload_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY(course_id) REFERENCES courses(course_id)
        ON DELETE CASCADE,
  UNIQUE(course_id, document_name)
);