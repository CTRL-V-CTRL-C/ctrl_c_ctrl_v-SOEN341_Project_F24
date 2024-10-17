DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
        CREATE TYPE role AS ENUM 
        (
            'INST', 'STUD'
        );
    END IF;
END$$;


CREATE TABLE IF NOT EXISTS users (
  user_id   SERIAL PRIMARY KEY,
  hash      BYTEA NOT NULL,
  f_name    VARCHAR(20) NOT NULL,
  l_name    VARCHAR(20) NOT NULL,
  email     VARCHAR(30) UNIQUE NOT NULL,
  school_id CHAR(8) UNIQUE NOT NULL,
  role      role NOT NULL
);