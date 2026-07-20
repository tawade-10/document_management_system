CREATE TABLE authority_profiles (
    authority_id CHAR(4) PRIMARY KEY,
    authority_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL
);