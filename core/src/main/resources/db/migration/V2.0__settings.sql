CREATE TABLE settings
(
    id              UUID         NOT NULL PRIMARY KEY,
    dark_mode_enabled boolean,
    user_id         VARCHAR(255) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
