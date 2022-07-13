import pg from "pg";
import dotenv from "dotenv";
//@ts-ignore
import console, { table } from "console";
// import type { Request, Response } from "express";
//@ts-ignore
import { friendRow } from "./interfaceModels";
dotenv.config();
const client = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
client.connect();

//////////////////////////////// join table example
// async function dataA() {
//   const data = await client.query(
//     `select
//         game_farm_data.user_id,
//         game_farm_data.game_map_records_id,
//         game_farm_data.game_items_list_id,
//         game_farm_data.score,
//         user_info.user_name
//         FROM game_farm_data join user_info
//         on game_farm_data.user_id = user_info.id
//         where game_farm_data.user_id = ($1)`,
//     [1]
//   );
//   console.log(data.rows);
// }

// dataA();
// result:
// [
//   {
//     user_id: 1,
//     game_map_records_id: null,
//     game_items_list_id: null,
//     score: 0,
//     user_name: "alex",
//   },
// ];
////////////////////////////////

// async function a() {
//   const dataA = await client.query(`select * from game_farm_data`);
//   console.log(dataA);
//   const dataB = await client.query(`select * from user_info`);
//   console.log(dataB);
// }

// a();
////////////////////////////////
// const allPlayerShowUpNumbers: number = 10;

// async function findAllPlayerRanking() {
//   const data = await client.query(
//     `select
//         game_farm_data.user_id,
//         game_farm_data.game_map_records_id,
//         game_farm_data.game_items_list_id,
//         game_farm_data.score,
//         user_info.user_name
//         FROM game_farm_data join user_info
//         on game_farm_data.user_id = user_info.id
//         ORDER by Score DESC LIMIT $1`,
//     [allPlayerShowUpNumbers]
//   );
//   // let rows = data.rows;
//   // console.log(data.rows);
//   // console.log(rows);
//   // return rows;
//   return data.rows;
// }
// async function findAllPlayerRankingB() {
//   const data = await client.query(
//     `select
//         game_farm_data.user_id,
//         game_farm_data.game_map_records_id,
//         game_farm_data.game_items_list_id,
//         game_farm_data.score,
//         user_info.user_name
//         FROM game_farm_data join user_info
//         on game_farm_data.user_id = user_info.id
//         ORDER by Score DESC LIMIT $1`,
//     [allPlayerShowUpNumbers]
//   );
//   // let rows = data.rows;
//   // console.log(data.rows);
//   // console.log(rows);
//   // return rows;
//   return data.rows;
// }

// // const result = findAllPlayerRanking();
// // console.log(result);

// export async function a() {
//   const result = await findAllPlayerRanking();
//   const resultB = await findAllPlayerRankingB();
//   // console.log(result);
//   const test = result.concat(resultB);
//   console.log(test);
//   // [
//   //   {
//   //     user_id: 1,
//   //     game_map_records_id: null,
//   //     game_items_list_id: null,
//   //     score: 0,
//   //     user_name: "alex",
//   //   },
//   //   {
//   //     user_id: 2,
//   //     game_map_records_id: null,
//   //     game_items_list_id: null,
//   //     score: 0,
//   //     user_name: "harry",
//   //   },
//   //   {
//   //     user_id: 3,
//   //     game_map_records_id: null,
//   //     game_items_list_id: null,
//   //     score: 0,
//   //     user_name: "jacky",
//   //   },
//   //   {
//   //     user_id: 1,
//   //     game_map_records_id: null,
//   //     game_items_list_id: null,
//   //     score: 0,
//   //     user_name: "alex",
//   //   },
//   //   {
//   //     user_id: 2,
//   //     game_map_records_id: null,
//   //     game_items_list_id: null,
//   //     score: 0,
//   //     user_name: "harry",
//   //   },
//   //   {
//   //     user_id: 3,
//   //     game_map_records_id: null,
//   //     game_items_list_id: null,
//   //     score: 0,
//   //     user_name: "jacky",
//   //   },
//   // ];
// }

// // a();

////////////////////////////////

// async function findAllFriend() {
//   const myFriends_rowB = await client.query<friendRow>(
//     `select user_id_a
//   from relationship
//   where user_id_b = $1`,
//     [2]
//   );
//   const fd_b = myFriends_rowB.rows;
//   console.log(fd_b);

//   let friends_result: string[] = [];
//   if (fd_b !== undefined) {
//     for (let row of fd_b) {
//       let result = await client.query(
//         `select
//         game_farm_data.user_id,
//         game_farm_data.game_map_records_id,
//         game_farm_data.game_items_list_id,
//         game_farm_data.score,
//         user_info.user_name
//         FROM game_farm_data join user_info
//         on game_farm_data.user_id = user_info.id
//         where game_farm_data.user_id = $1`,
//         [row.user_id_a]
//       );
//       friends_result.push(result.rows[0]);
//       // console.log(friends_result);
//     }
//   }
//   const myFriends_rowA = await client.query<friendRow>(
//     `select user_id_b
//   from relationship
//   where user_id_a = $1`,
//     [2]
//   );
//   ////////////////////////////////
//   const fd_a = myFriends_rowA.rows;
//   console.log(fd_a);

//   // let friends_result_rowA: string[] = [];
//   if (fd_a !== undefined) {
//     for (let row of fd_a) {
//       let result = await client.query(
//         `select
//         game_farm_data.user_id,
//         game_farm_data.game_map_records_id,
//         game_farm_data.game_items_list_id,
//         game_farm_data.score,
//         user_info.user_name
//         FROM game_farm_data join user_info
//         on game_farm_data.user_id = user_info.id
//         where game_farm_data.user_id = $1`,
//         [row.user_id_b]
//       );
//       friends_result.push(result.rows[0]);
//       // console.log(friends_result);
//     }
//   }
//   // console.log(friends_result);
//   return friends_result;
// }

// async function friends_ranking() {
//   const fd_result = await findAllFriend();
//   console.log(fd_result);
// }
// friends_ranking();

// //////////////////////////////// testing functions //////////////////
// const testing = await client.query(`select create_at from user_info`);
// console.log(testing.rows);
// // return
// // [
// //   { create_at: 2022-07-05T14:27:27.100Z },
// //   { create_at: 2022-07-05T14:27:27.100Z },
// //   { create_at: 2022-07-05T14:27:27.100Z },
// //   { create_at: 2022-07-06T04:25:44.049Z },
// //   { create_at: 2022-07-06T04:25:44.049Z },
// //   { create_at: 2022-07-06T04:25:44.049Z }
// // ]
// console.log(testing.rows[0].create_at); // 2022-07-05T14:27:27.100Z
// const create_at = testing.rows[0].create_at;
// const diffOfTime = (new Date().getTime() - new Date(create_at).getTime()) / 1000;
// console.log(`${diffOfTime} s`); // return as seconds
// ////////////////////////////////////////////////////////////////////

async function a() {
  const suggestFriend = await client.query(
    `SELECT * 
    FROM user_info 
    WHERE 
    id != $1 
    AND id 
    NOT IN (
      SELECT user_id_b 
      FROM relationship 
      WHERE user_id_a = $1) OR 
      NOT IN (
        SELECT user_id_a 
        FROM relationship 
        WHERE user_id_b = $1)`,
    [4]
  );
  return suggestFriend;
}

console.log(a());
