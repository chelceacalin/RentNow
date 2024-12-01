create table if not exists category
(
    id           uuid    not null
        constraint category_pkey primary key,
    is_available boolean not null,
    name         varchar(255)
);

create table if not exists users
(
    id         varchar(255) not null
        constraint users_pkey
            primary key,
    email      varchar(255)
        constraint email_unique_key
            unique,
    first_name varchar(255),
    last_name  varchar(255),
    photo_url  varchar(255),
    role       varchar(255)
        constraint users_role_check
            check ((role)::text = ANY ((ARRAY ['ADMIN'::character varying, 'USER'::character varying])::text[])),
    username   varchar(255)
);

create table if not exists book
(
    id           uuid not null
        constraint book_pkey
            primary key,
    description varchar(4000),
    director     varchar(255),
    is_available boolean,
    title        varchar(255),
    photo_url varchar(255),
    category_id  uuid
        constraint fk_book_category_id
            references category,
    owner_id     varchar(255)
        constraint fk_book_owner_id
            references users
);

create table if not exists book_history
(
    id           uuid not null,
    description  varchar(4000),
    rating       integer,
    rented_date  date,
    rented_until date,
    book_id uuid,
    user_id      varchar(255),
    constraint pk_book_history primary key (id, book_id, user_id),
    constraint fk_mh_book_id foreign key (book_id) references book,
    constraint fk_mh_user_id foreign key (user_id) references users
);
