import pg from "pg";
import dotenv from "dotenv";
import console from "console";
// import type { Request, Response } from "express";
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

async function findAllFriend() {
  // const myself = req.session["user"];
  const myFriends_rowB = await client.query<friendRow>(
    `select user_id_a
  from relationship
  where user_id_b = $1`,
    [2]
  );
  const fd_b = myFriends_rowB.rows;
  console.log(fd_b);

  let friends_result_rowB: string[] = [];
  for (let row of fd_b) {
    friends_result_rowB.push(
      `select
        game_farm_data.user_id,
        game_farm_data.game_map_records_id,
        game_farm_data.game_items_list_id,
        game_farm_data.score,
        user_info.user_name
        FROM game_farm_data join user_info
        on game_farm_data.user_id = user_info.id 
        where game_farm_data.user_id = $1`,
      [row.user_id_b]
    );
  }

  ////////////////////////////////

  const myFriends_rowA = await client.query<friendRow>(
    `select user_id_b
    from relationship
    where user_id_a = $1`,
    [2]
  );
  const fd_a = myFriends_rowA.rows;
  console.log(fd_a);

  //////////////////////////////////////////

  // console.log(myFriends_rowA, myFriends_rowB);
  // for (let friend of myFriends_rowA.rows) {
  //   const data: number = friend.user_id_b;
  //   friendList.push(data);
  // }
  // for (let friend of myFriends_rowB.rows) {
  //   const data: number = friend.user_id_a;
  //   friendList.push(data);
  // }
  console.log(friendList);
  let result;
  for (let showMyFriends of friendList) {
    result = client.query(`select user_name, score from game_farm_data where user_id = $1`, [
      showMyFriends,
    ]);
  }
  console.log(result);
  // // res.json(result);
}

findAllFriend();
