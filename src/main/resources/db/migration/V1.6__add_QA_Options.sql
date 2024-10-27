CREATE TABLE QA
(
    id           uuid not null primary key,
    question     varchar(255),
    answer       varchar(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);