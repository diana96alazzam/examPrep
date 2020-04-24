DROP TABLE IF EXISTS preptable;

CREATE TABLE preptable (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    age NUMERIC (3)
)