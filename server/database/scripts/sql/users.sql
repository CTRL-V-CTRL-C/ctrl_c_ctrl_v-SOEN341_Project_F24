CREATE TABLE IF NOT EXISTS users (
  user_id   SERIAL PRIMARY KEY,
  username  VARCHAR(30) UNIQUE NOT NULL,
  hash      BYTEA NOT NULL,
  salt      CHAR(16) NOT NULL,
  f_name    VARCHAR(20) NOT NULL,
  l_name    VARCHAR(20) NOT NULL,
  email     VARCHAR(30) UNIQUE NOT NULL,
  school_id CHAR(8) UNIQUE NOT NULL,
  role      CHAR(4) NOT NULL
);