INSERT INTO category(id, name, is_available, created_date, updated_date)
VALUES ('988336ce-1322-4e67-97f4-6579ed9ae1be', 'Drama', true, '2024-10-19 10:35:17.152009', '2024-10-19 10:35:17.152009')
ON CONFLICT (id) DO NOTHING;
