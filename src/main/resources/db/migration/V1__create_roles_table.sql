CREATE TABLE roles (
    role_id CHAR(4) PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL
);