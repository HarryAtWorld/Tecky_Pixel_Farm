import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";
import { friendRow } from "../interfaceModels";

export const friendRankRoutes = express.Router();

friendRankRoutes.get("/", friends_ranking);

export async function friends_ranking(req: Request, res: Response) {
  const user = req.session["user"];
  console.log(`passed friends_ranking my i97867d : ${user.id}`);
  const fd_result = await findAllFriend(user.id);
  console.log(fd_result);
  res.json(fd_result);
}

// function for findAllFriend
async function findAllFriend(my_id: number) {
  let friends_result: string[] = [];

  const myFriends_rowB = await client.query<friendRow>(
    `select user_id_a
  from relationship
  where user_id_b = $1`,
    [my_id]
  );
  const fd_b = myFriends_rowB.rows;
  console.log(`My fd in row_a : ${fd_b}`);

  if (fd_b !== undefined) {
    for (let row of fd_b) {
      let result = await client.query(
        `select
        game_farm_data.user_id,
        game_farm_data.game_map_records_id,
        game_farm_data.game_items_list_id,
        game_farm_data.score,
        user_info.user_name
        FROM game_farm_data join user_info
        on game_farm_data.user_id = user_info.id 
        where game_farm_data.user_id = $1`,
        [row.user_id_a]
      );
      friends_result.push(result.rows[0]);
      // console.log(friends_result);
    }
  }

  const myFriends_rowA = await client.query<friendRow>(
    `select user_id_b
  from relationship
  where user_id_a = $1`,
    [my_id]
  );
  ////////////////////////////////
  const fd_a = myFriends_rowA.rows;
  console.log(`My fd in row_b : ${fd_a}`);

  if (fd_a !== undefined) {
    for (let row of fd_a) {
      let result = await client.query(
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
      friends_result.push(result.rows[0]);
      // console.log(friends_result);
    }
  }
  // friends_result.sort((a,b) => b.score - a.score);
  // console.log(`Sorting`);
  // friends_result.sort();
  // console.log(friends_result);
  // console.log(`End sorting`);
  return friends_result;
}
