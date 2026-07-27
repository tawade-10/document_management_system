INSERT INTO users (
    user_id,
    user_name,
    email,
    password,
    authority_id,
    status_id,
    created_at,
    updated_at
)
VALUES
(
    'U0A0000',
    'Root Admin',
    'root@gmail.com',
    'root@123',
    '0000',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U3A0001',
    'System Admin',
    'admin@gmail.com',
    'admin@123',
    '0003',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
)
ON CONFLICT (email) DO NOTHING;