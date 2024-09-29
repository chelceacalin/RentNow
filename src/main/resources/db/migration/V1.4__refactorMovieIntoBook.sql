-- Rename Constraints
ALTER TABLE book RENAME CONSTRAINT fk_movie_category_id TO fk_book_category_id;
ALTER TABLE book RENAME CONSTRAINT fk_movie_owner_id TO fk_book_owner_id;
ALTER TABLE book RENAME CONSTRAINT movie_pkey TO book_pkey;
ALTER TABLE movie_history RENAME CONSTRAINT fk_mh_movie_id TO fk_mh_book_id;
ALTER TABLE movie_history RENAME CONSTRAINT pk_movie_history TO pk_book_history;

-- Rename Book
ALTER TABLE book RENAME TO book;

-- Rename Book movie_history
ALTER TABLE movie_history RENAME TO book_history;
ALTER TABLE book_history RENAME COLUMN movie_id TO book_id;

