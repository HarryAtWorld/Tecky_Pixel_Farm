select *
from relationship
where user_id_a = 1;
select *
from user_info;
SELECT *
from game_farm_data;
DELETE from relationship;
DELETE from game_farm_data;
delete from user_status;
DELETE from user_info;
insert into relationship (user_id_a, user_id_b)
VALUES (29, 30);
insert into relationship (user_id_a, user_id_b)
VALUES (29, 31);
insert into relationship (user_id_a, user_id_b)
VALUES (30, 31);