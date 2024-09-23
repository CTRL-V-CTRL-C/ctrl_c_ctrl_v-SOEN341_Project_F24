import { db } from "../db.js";

//Create users table
db.query("CREATE TABLE IF NOT EXISTS users (\
  user_id   serial PRIMARY KEY,\
  username  varchar(30) UNIQUE NOT NULL,\
  hash      bytea NOT NULL,\
  salt      char(16) NOT NULL,\
  f_name    varchar(20) NOT NULL,\
  l_name    varchar(20) NOT NULL,\
  school_id char(8) UNIQUE NOT NULL,\
  role      char(4) NOT NULL\
  )");

//Create Courses table

//Create Teams table

