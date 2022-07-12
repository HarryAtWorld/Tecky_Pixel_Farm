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
CREATE TABLE plant_score_data (
    items_id Serial primary key,
    items_name varchar(255) not null,
    stage_0_score INTEGER,
    stage_0_life INTEGER,
    stage_1_score INTEGER,
    stage_1_life INTEGER,
    stage_2_score INTEGER,
    stage_2_life INTEGER,
    stage_3_score INTEGER
);
-- game_farm_data table --
CREATE TABLE game_farm_data(
    id serial primary key,
    user_id INTEGER not NULL,
    FOREIGN key (user_id) REFERENCES user_info(id),
    game_map_records_id json,
    game_items_list_id json,
    score INTEGER default 0
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
    logout_time TIMESTAMP,
    last_score_update_time TIMESTAMP
);
----------------------------------------------------------------
--
-- insert into user_info (login_account, login_password, user_name)
-- values ('alex@gmail.com', 'aaa111', 'alex');
-- insert into user_info (login_account, login_password, user_name)
-- values ('harry@gmail.com', 'harry', 'harry');
-- insert into user_info (login_account, login_password, user_name)
-- values ('jacky@gmail.com', 'jacky', 'jacky');
--
INSERT into plant_score_data (
        items_name,
        stage_0_score,
        stage_0_life,
        stage_1_score,
        stage_1_life,
        stage_2_score,
        stage_2_life,
        stage_3_score
    )
VALUES ('carrot', 1, 40, 2, 40, 3, 30, 0);
INSERT into plant_score_data (
        items_name,
        stage_0_score,
        stage_0_life,
        stage_1_score,
        stage_1_life,
        stage_2_score,
        stage_2_life,
        stage_3_score
    )
VALUES ('corn', 1, 40, 2, 40, 3, 30, 0);
INSERT into plant_score_data (
        items_name,
        stage_0_score,
        stage_0_life,
        stage_1_score,
        stage_1_life,
        stage_2_score,
        stage_2_life,
        stage_3_score
    )
VALUES ('yellow_flower', 1, 20, 2, 20, 3, 20, 0);
INSERT into plant_score_data (
        items_name,
        stage_0_score,
        stage_0_life,
        stage_1_score,
        stage_1_life,
        stage_2_score,
        stage_2_life,
        stage_3_score
    )
VALUES ('red_flower', 1, 20, 2, 20, 3, 20, 0);
INSERT into plant_score_data (
        items_name,
        stage_0_score,
        stage_0_life,
        stage_1_score,
        stage_1_life,
        stage_2_score,
        stage_2_life,
        stage_3_score
    )
VALUES ('blue_flower', 1, 20, 2, 20, 3, 20, 0);
INSERT into plant_score_data (
        items_name,
        stage_0_score,
        stage_0_life,
        stage_1_score,
        stage_1_life,
        stage_2_score,
        stage_2_life,
        stage_3_score
    )
VALUES ('pumpkin', 1, 40, 2, 40, 3, 30, 0);
INSERT into plant_score_data (
        items_name,
        stage_0_score,
        stage_0_life,
        stage_1_score,
        stage_1_life,
        stage_2_score,
        stage_2_life,
        stage_3_score
    )
VALUES ('lettuce', 1, 40, 2, 40, 3, 30, 0);
INSERT into plant_score_data (
        items_name,
        stage_0_score,
        stage_0_life,
        stage_1_score,
        stage_1_life,
        stage_2_score,
        stage_2_life,
        stage_3_score
    )
VALUES ('green_trees', 2, 60, 3, 600, 5, 6000, 0);
INSERT into plant_score_data (
        items_name,
        stage_0_score,
        stage_0_life,
        stage_1_score,
        stage_1_life,
        stage_2_score,
        stage_2_life,
        stage_3_score
    )
VALUES ('brown_trees', 2, 60, 3, 600, 5, 6000, 0);
INSERT into plant_score_data (items_name, stage_0_score)
VALUES ('small_house', -5);
INSERT into plant_score_data (items_name, stage_0_score)
VALUES ('big_house', -15);
--
Insert into game_farm_data (user_id)
VALUES (1);
Insert into game_farm_data (user_id)
VALUES (2);
Insert into game_farm_data (user_id)
VALUES (3);
insert into game_farm_data (user_id)
values (4);
insert into relationship (user_id_a, user_id_b)
VALUES (1, 2);
insert into relationship (user_id_a, user_id_b)
VALUES (1, 3);
insert into relationship (user_id_a, user_id_b)
VALUES (2, 3);
----------------------------------------------------------------
-- DROP TABLE relationship;
-- DROP TABLE game_farm_data;
-- DROP TABLE plant_score_data;
-- DROP TABLE user_status;
-- DROP TABLE user_info;
----------------------------------------------------------------
-- DELETE from relationship;
-- DELETE from game_farm_data;
-- delete from user_status;
-- DELETE from user_info;
----------------------------------------------------------------
select *
from user_info;
select *
from plant_score_data;
SELECT *
FROM game_farm_data;
SELECT *
FROM user_status;
select *
FROM relationship;