import pg from "pg";
import dotenv from "dotenv";
import console from "console";
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

// // const result = findAllPlayerRanking();
// // console.log(result);

// async function a() {
//   const result = await findAllPlayerRanking();
//   console.log(result);
// }

// a();
