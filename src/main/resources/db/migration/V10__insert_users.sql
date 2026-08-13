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
    'Password@123',
    '0000',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U3A0001',
    'System Admin',
    'admin@gmail.com',
    'Password@123',
    '0003',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U2A0004',
    'Rahul Mehta',
    'rahul@gmail.com',
    'Password@123',
    '0002',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U2A0005',
    'Priya Sharma',
    'priya@gmail.com',
    'Password@123',
    '0002',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U2A0006',
    'Amit Patil',
    'amit@gmail.com',
    'Password@123',
    '0002',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U2A0007',
    'Sneha Joshi',
    'sneha@gmail.com',
    'Password@123',
    '0002',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U3A0002',
    'Vikram Desai',
    'vikram@gmail.com',
    'Password@123',
    '0003',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U3A0003',
    'Neha Kulkarni',
    'neha@gmail.com',
    'Password@123',
    '0003',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U5A0008',
    'Rohan Deshmukh',
    'rohan@gmail.com',
    'Password@123',
    '0005',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U5A0009',
    'Karan Shah',
    'karan@gmail.com',
    'Password@123',
    '0005',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U5A0010',
    'Pooja Nair',
    'pooja@gmail.com',
    'Password@123',
    '0005',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U5A0011',
    'Arjun Malhotra',
    'arjun@gmail.com',
    'Password@123',
    '0005',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U5A0012',
    'Ananya Iyer',
    'ananya@gmail.com',
    'Password@123',
    '0005',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
),
(
    'U5A0013',
    'Siddharth Rao',
    'siddharth@gmail.com',
    'Password@123',
    '0005',
    'UAC',
    CURRENT_TIMESTAMP,
    NULL
)
ON CONFLICT (email) DO NOTHING;