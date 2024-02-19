create table category
(
    id           uuid    not null primary key,
    name         varchar(255),
    is_available boolean not null
);

create table movie
(
    id           uuid    not null primary key,
    category_id  uuid
        constraint fk_category_id references category,
    description  varchar(255),
    director     varchar(255),
    is_available boolean not null,
    title        varchar(255),
    owner_id     varchar(255)
        constraint fk_owner_id
            references users
);

create table movie_history
(
    id           uuid         not null,
    description  varchar(255),
    rented_date  date,
    rented_until date,
    rating       numeric,
    movie_id     uuid         not null
        constraint fk_movie_id references movie,
    user_id      varchar(255) not null
        constraint fk_user_id references users
);

alter table movie_history
    add constraint pk_movie_history
        primary key (id, movie_id, user_id);