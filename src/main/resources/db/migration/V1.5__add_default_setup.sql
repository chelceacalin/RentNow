INSERT INTO category(id, name, is_available, created_date, updated_date)
VALUES ('988336ce-1322-4e67-97f4-6579ed9ae1be', 'Drama', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
