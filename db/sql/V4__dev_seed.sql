-- Dev-only seed user. ID must match DEV_USER_ID in .env (default below).
INSERT INTO app_user (id, email, created_at)
VALUES (
    '00000000-0000-4000-8000-000000000001'::uuid,
    'dev@retrocart.local',
    now()
)
ON CONFLICT (id) DO NOTHING;
