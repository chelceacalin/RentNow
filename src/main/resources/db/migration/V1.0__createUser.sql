create table Users
(
    id         varchar(255) not null primary key,
    first_name varchar(255),
    last_name  varchar(255),
    username   varchar(255),
    email      varchar(255),
    is_active  boolean,
    role       varchar(255),
    createdDate date,
    updatedDate date
);
