CREATE TABLE IF NOT EXISTS pages (
    page_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    page_content TEXT,
    participants TEXT,
    status_id VARCHAR(255) NOT NULL,
    notebook_id VARCHAR(255),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    published_at TIMESTAMP,
    archived_at TIMESTAMP,

    CONSTRAINT fk_pages_status
        FOREIGN KEY (status_id)
        REFERENCES status(status_id),

    CONSTRAINT fk_pages_notebook
        FOREIGN KEY (notebook_id)
        REFERENCES notebooks(notebook_id),

    CONSTRAINT fk_pages_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
);