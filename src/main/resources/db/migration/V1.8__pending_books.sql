ALTER TABLE book_history
    ADD COLUMN status VARCHAR(10) CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'));
