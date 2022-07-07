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
    items_image varchar(255)
);
-- game_farm_data table --
CREATE TABLE game_farm_data(
    user_id INTEGER not NULL,
    FOREIGN key (user_id) REFERENCES user_info(id),
    game_map_records json,
    game_items json,
    score INTEGER default 0
);
-- game_plants_data --
CREATE TABLE game_plants_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user_info (id),
    items_id INTEGER,
    FOREIGN KEY (items_id) REFERENCES game_plants_list(items_id),
    xylocation json,
    stage INTEGER DEFAULT 1,
    create_at TIMESTAMP DEFAULT now()
);
-- relationship table --
CREATE TABLE relationship (
    id SERIAL PRIMARY KEY,
    user_id_a INTEGER,
    FOREIGN key (user_id_a) REFERENCES user_info(id),
    user_id_b INTEGER,
    FOREIGN key (user_id_b) REFERENCES user_info(id),
    create_at TIMESTAMP DEFAULT now()
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
FROM game_plants_data;
SELECT *
FROM user_status;
select *
FROM relationship;
----------------------------------------------------------------
--
insert into user_info (login_account, login_password, user_name)
values ('alex@gmail.com', 'aaa111', 'alex');
insert into user_info (login_account, login_password, user_name)
values ('harry@gmail.com', 'harry', 'harry');
insert into user_info (login_account, login_password, user_name)
values ('jacky@gmail.com', 'jacky', 'jacky');
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
VALUES (1);
--
insert into relationship (user_id_a, user_id_b)
VALUES (1, 2);
insert into relationship (user_id_a, user_id_b)
VALUES (1, 3);
insert into relationship (user_id_a, user_id_b)
VALUES (2, 3);
----------------------------------------------------------------
-- DROP TABLE relationship;
-- DROP TABLE game_farm_data;
-- DROP TABLE game_plants_data;
-- DROP TABLE game_plants_list;
-- DROP TABLE user_status;
-- DROP TABLE user_info;