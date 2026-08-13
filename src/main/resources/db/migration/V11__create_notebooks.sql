CREATE TABLE IF NOT EXISTS notebooks (
    notebook_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status_id VARCHAR(10) NOT NULL,
    created_by VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,

    CONSTRAINT fk_notebooks_status
        FOREIGN KEY (status_id)
        REFERENCES status(status_id),

    CONSTRAINT fk_notebooks_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
);