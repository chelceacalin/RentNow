CREATE TABLE Review
(
    id           uuid not null primary key ,
    book_id      uuid not null,
    user_id      varchar(255) NOT NULL,
    rating       INT,
    state        INT,
    text         TEXT,
    created_date TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES Book (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE Comment
(
    id           uuid not null primary key ,
    review_id         uuid,
    parent_comment_id uuid,
    user_id           varchar(255) NOT NULL,
    comment           TEXT,
    created_date      TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES Review (id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES Comment (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
