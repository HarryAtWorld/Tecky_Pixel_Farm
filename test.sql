-- user current friend
select user_id_b
from relationship
where user_id_a = 5;
SELECT *
FROM user_info
WHERE user_info.id != (
        select user_id_b
        from relationship
        where user_id_a = 5
    );
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
select *
from relationship
where user_id_a = 1;
select *
from relationship
    LEFT JOIN user_info ON user_id_a = user_info.user_id_b;
select *
from user_info
    LEFT JOIN relationship ON user_info.id = relationship.user_id_a;
select *
from user_info
    FULL OUTER JOIN relationship ON user_info.id = relationship.user_id_b
    AND user_info.id = relationship.user_id_a;
--
-- SELECT *
-- FROM user_info
-- WHERE user_info.id != 4
--     AND user_info.id != (
--         select user_id_b
--         from relationship
--         where user_id_a = 4
--     )
--     AND user_info.id != (
--         select user_id_a
--         from relationship
--         where user_id_b = 4
--     )
-- ORDER BY random()
-- limit 5;