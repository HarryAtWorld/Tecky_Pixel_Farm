import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";
import { friendRowA, friendRowB } from "../interfaceModels";
import { getUserInfo } from "./loginRoutes";

export const rankingRoutes = express.Router();

rankingRoutes.get("/allPlayerRank", allPlayerRank);
rankingRoutes.get("/friendRank", getUserInfo, friendRank);

// query setting
const allPlayerShowUpNumbers: number = 10;
// response all player Rank
async function allPlayerRank(req: Request, res: Response) {
  const all_player_ranking_list = await findAllPlayerRanking();
  console.log(all_player_ranking_list);
  res.json(all_player_ranking_list);
}

async function findAllPlayerRanking() {
  let data = await client.query(
    `select
        game_farm_data.user_id,
        game_farm_data.game_map_records_id,
        game_farm_data.game_items_list_id,
        game_farm_data.score,
        user_info.user_name
        FROM game_farm_data join user_info
        on game_farm_data.user_id = user_info.id
        ORDER by Score DESC LIMIT $1`,
    [allPlayerShowUpNumbers]
  );
  return data.rows;
}
////////////////////////////////////////////////////////////////
export async function friendRank(req: Request, res: Response) {
  const friendList = await findAllFriend;
  console.log(friendList);
  const friend_ranking_list = findFriendRanking();
  res.json(friend_ranking_list);
}

async function findFriendRanking() {}

async function findAllFriend(req: Request, res: Response) {
  const myself = req.session["user"];
  const myFriends_rowB = await client.query<friendRowA>(
    `select user_id_a
  from relationship
  where user_id_b = $1`,
    [myself.user_id]
  );
  const myFriends_rowA = await client.query<friendRowB>(
    `select user_id_b from relationship where user_id_a = $1`,
    [myself.user_id]
  );
  console.log(myFriends_rowA, myFriends_rowB);
  let friendList: number[] = [];
  for (let friend of myFriends_rowA.rows) {
    const data: number = friend.user_id_b;
    friendList.push(data);
  }
  for (let friend of myFriends_rowB.rows) {
    const data: number = friend.user_id_a;
    friendList.push(data);
  }
  console.log(friendList);

  let result;
  for (let showMyFriends of friendList) {
    result = client.query(`select user_name, score from game_farm_data where user_id = $1`, [
      showMyFriends,
    ]);
  }
  res.json(result);
}
