-- psql 
-- you can use it in vscode sqltools or copy to terminal/powershell
-- CREATE DATABASE teckywspproject;
--
CREATE TABLE player (
    user_id SERIAL primary key,
    login_Account VARCHAR(255) not null,
    login_Password INTEGER not null,
    google_token VARCHAR(255),
    account_created_at DEFAULT CURRENT_TIMESTAMP NOT NULL,
);
--
<<<<<<< HEAD
insert into player (login_Account, login_Password)
values ----------------------------------------------------------------
    CREATE TABLE game_plants_list (
        items_id Serial primary key,
        items_name varchar(255) not null,
        items_count integer DEFAULT 0 NOT NULL
    );
--
=======
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
>>>>>>> 3e5cdbbcf850fb20e11a7d76c2f27aeef41be449
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
<<<<<<< HEAD
INSERT into game_plants_list (items_name)
=======
INSERT into game_plants_list (items_name) 
>>>>>>> 3e5cdbbcf850fb20e11a7d76c2f27aeef41be449
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
select *
from player;
select *
from game_plants_list;