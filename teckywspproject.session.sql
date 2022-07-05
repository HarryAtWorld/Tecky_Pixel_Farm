-- psql 
-- you can use it in vscode sqltools or copy to terminal/powershell
CREATE DATABASE teckywspproject;
--
CREATE TABLE player (
    user_id SERIAL primary key,
    login_Account VARCHAR(255) not null,
    login_Password INTEGER not null,
    google_token VARCHAR(255)
);
--
CREATE TABLE game_plants_list (
    items_id Serial primary key,
    items_name varchar(255) not null,
    items_count integer DEFAULT 0 NOT NULL
);
-- ALTER TABLE game_plants_list
-- ALTER COLUMN items_count TYPE int USING (COALESCE(items_count, 0)),
--     ALTER COLUMN items_count
-- SET DEFAULT 0,
--     ALTER COLUMN items_count
-- SET NOT NULL;
INSERT into game_plants_list (items_name, items_count)
VALUES ('carrot');
INSERT into game_plants_list (items_name, items_count)
VALUES ('corn');
INSERT into game_plants_list (items_name, items_count)
VALUES ('yellow_flower');
INSERT into game_plants_list (items_name, items_count)
VALUES ('red_flower');
INSERT into game_plants_list (items_name, items_count)
VALUES ('blue_flower');
INSERT into game_plants_list (items_name, items_count)
VALUES ('pumpkin');
INSERT into game_plants_list (items_name, items_count)
VALUES ('lettuce');
INSERT into game_plants_list (items_name, items_count)
VALUES ('green_trees');
INSERT into game_plants_list (items_name, items_count)
VALUES ('brown_trees');
INSERT into game_plants_list (items_name, items_count)
VALUES ('small_house');
INSERT into game_plants_list (items_name, items_count)
VALUES ('big_house');
--
select *
from player;
select *
from game_plants_list;