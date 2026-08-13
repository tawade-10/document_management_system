CREATE TABLE IF NOT EXISTS attachments (
    attachment_id VARCHAR(10) PRIMARY KEY,
    page_id VARCHAR(10) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    attached_by VARCHAR(255) NOT NULL,
    attached_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_attachments_page
        FOREIGN KEY (page_id)
        REFERENCES pages(page_id),

    CONSTRAINT fk_attachments_user
        FOREIGN KEY (attached_by)
        REFERENCES users(user_id)
);