-- psql 
-- you can use it in vscode sqltools or copy to terminal/powershell
-- CREATE DATABASE teckywspproject;
--
----------------------------------------------------------------
-- player table --
----------------------------------------------------------------
-- drop table user_info;
--
CREATE TABLE user_info (
    user_id SERIAL primary key,
    login_Account VARCHAR(255) not null,
    login_Password VARCHAR(255) not null,
    google_token VARCHAR(255),
    user_name VARCHAR(255) not null,
    user_icon VARCHAR(255),
    create_at TIMESTAMP default now()
);
--
insert into user_info (login_Account, login_Password, user_name)
values ('alex', 'aaa111', 'alex');
insert into user_info (login_Account, login_Password, user_name)
values ('harry', 'harry', 'harry');
insert into user_info (login_Account, login_Password, user_name)
values ('jacky', 'jacky', 'jacky');
----------------------------------------------------------------
-- game_plants_list table --
----------------------------------------------------------------
-- drop table game_plants_list;
--
CREATE TABLE game_plants_list (
    items_id Serial primary key,
    items_name varchar(255) not null,
    items_count integer DEFAULT 0 NOT NULL
);
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
----------------------------------------------------------------
-- game_center --
----------------------------------------------------------------
-- drop TABLE game_center;
--
-- CREATE TABLE game_center(
--     game_id Serial PRIMARY KEY,
--     game_name VARCHAR(255) NOT NULL,
--     game_created timestamp DEFAULT now(),
--     game_version VARCHAR(255) NOT NULL,
--     game_updated timestamp DEFAULT now()
-- );
----------------------------------------------------------------
-- game_farm_data --
----------------------------------------------------------------
-- drop table game_farm_data;
--
CREATE TABLE game_farm_data(
    user_id INTEGER REFERENCES user_info(user_id),
    game_map json,
    game_items json,
    marks INTEGER default 0
);
----------------------------------------------------------------
-- user_id_friend --
----------------------------------------------------------------
-- for add friend query using in routers
-- const userAddFD = client.query(
--     `select user_id from user_info where user_name = ${user)`
-- );
-- const addFriends_ID = client.query(
--     `select user_id from user_info where user_name = ${find_friend}`
-- );
-- client.query(
--     `CREATE TABLE ${userAddFD}_friend (friends_id integer`
-- );
-- client.query(
--     `
-- INSERT INTO $ { userAddFD } _friend (friends_id)
-- VALUES ($1),
--     [addFriends_ID]
-- `
-- );
----------------------------------------------------------------
select *
from user_info;
select *
from game_plants_list;