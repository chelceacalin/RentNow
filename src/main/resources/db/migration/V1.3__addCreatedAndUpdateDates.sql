ALTER TABLE movie
    ADD created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE category
    ADD created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE movie_history
    ADD created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE users
    ADD created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


