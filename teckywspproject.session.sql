-- player table --
CREATE TABLE user_info (
    id SERIAL primary key,
    login_account VARCHAR(255) not null,
    login_password VARCHAR(255) not null,
    google_token VARCHAR(255),
    user_name VARCHAR(255) not null,
    user_icon VARCHAR(255),
    create_at TIMESTAMP default now()
);
-- game_plants_list table --
CREATE TABLE game_plants_list (
    items_id Serial primary key,
    items_name varchar(255) not null,
    items_count integer DEFAULT 0 NOT NULL
);
-- game_farm_data table --
CREATE TABLE game_farm_data(
    user_id INTEGER,
    FOREIGN key (user_id) REFERENCES user_info(id),
    game_map_records json,
    game_items json,
    score INTEGER default 0
);
-- relationship table --
CREATE TABLE relationship (
    id SERIAL PRIMARY KEY,
    user_id_a INTEGER,
    FOREIGN key (user_id_a) REFERENCES user_info(id),
    user_id_b INTEGER,
    FOREIGN key (user_id_b) REFERENCES user_info(id),
    created_at TIMESTAMP DEFAULT now()
);
-- user_status table --
CREATE TABLE user_status (
    user_id INTEGER,
    FOREIGN key (user_id) REFERENCES user_info(id),
    login_time TIMESTAMP,
    logout_time TIMESTAMP
);
----------------------------------------------------------------
select *
from user_info;
select *
from game_plants_list;
SELECT *
FROM game_farm_data;
SELECT *
FROM user_status;
select *
FROM relationship;
----------------------------------------------------------------
--
insert into user_info (login_account, login_password, user_name)
values ('alex@gmail.com', 'aaa111', 'alex2');
insert into user_info (login_account, login_password, user_name)
values ('harry@gmail.com', 'harry', 'harry2');
insert into user_info (login_account, login_password, user_name)
values ('jacky@gmail.com', 'jacky', 'jacky2');
--
INSERT into game_plants_list (items_name)
VALUES ('carrot');
INSERT into game_plants_list (items_name)
VALUES ('corn');
INSERT into game_plants_list (items_name)
VALUES ('yellow_flower');
INSERT into game_plants_list (items_name)
VALUES ('red_flower');
INSERT into game_plants_list (items_name)
VALUES ('blue_flower');
INSERT into game_plants_list (items_name)
VALUES ('pumpkin');
INSERT into game_plants_list (items_name)
VALUES ('lettuce');
INSERT into game_plants_list (items_name)
VALUES ('green_trees');
INSERT into game_plants_list (items_name)
VALUES ('brown_trees');
INSERT into game_plants_list (items_name)
VALUES ('small_house');
INSERT into game_plants_list (items_name)
VALUES ('big_house');
--
Insert into game_farm_data (user_id)
VALUES (3);
--
insert into relationship (user_id_a, user_id_b)
VALUES (2, 3);
----------------------------------------------------------------
-- DROP TABLE relationship;
-- DROP TABLE game_farm_data;
-- DROP TABLE user_info;
-- DROP TABLE game_plants_list;