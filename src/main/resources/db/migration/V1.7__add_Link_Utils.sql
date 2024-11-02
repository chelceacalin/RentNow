CREATE TABLE LINK
(
    id           uuid not null primary key,
    name     varchar(255),
    description       varchar(255),
    url       varchar(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);