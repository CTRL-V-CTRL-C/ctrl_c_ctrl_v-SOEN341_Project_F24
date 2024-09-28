CREATE TABLE IF NOT EXISTS teams
(
    team_id   SERIAL PRIMARY KEY,
    team_name VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS team_members
(
    user_id INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    FOREIGN KEY(team_id) REFERENCES teams(team_id)
        ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);