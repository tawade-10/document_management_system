CREATE TABLE users (
    user_id VARCHAR(10) PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    authority_id VARCHAR(4) NOT NULL,
    status_id VARCHAR(3) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_users_authority
        FOREIGN KEY (authority_id)
        REFERENCES authority_profiles(authority_id),

    CONSTRAINT fk_users_status
        FOREIGN KEY (status_id)
        REFERENCES status(status_id)
);