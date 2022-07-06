import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";
import { rankingLevel } from "../interfaceModels";
import console from "console";
// import { getUserInfo } from "./loginRoutes";

export const rankingRoutes = express.Router();

rankingRoutes.get("/allPlayerRank", allPlayerRank);
// rankingRoutes.get("/friendRank", getUserInfo, friendRank);

async function allPlayerRank(req: Request, res: Response) {
  const all_player_ranking_list = findAllPlayerRanking();
  res.json(all_player_ranking_list);
}

async function findAllPlayerRanking() {
  await client.query<rankingLevel>(`select user_id,
    user_name, 
    score
    from game_farm_data ORDER BY score DESC`);
}
////////////////////////////////////////////////////////////////
export async function friendRank(req: Request, res: Response) {
  const friend_ranking_list = findFriendRanking();
  res.json(friend_ranking_list);
}

async function findFriendRanking() {}

export async function findAllFriend(req: Request, res: Response) {
  const myself = req.session["user"];
  const myFriends = await client.query<rankingLevel>(
    `select user_id,
  user_name,
  score where user_id_a = $1 OR user_id_b = $1`,
    [myself.user_id]
  );

  console.log(myFriends);

  // for (let myFriend of myFriends) {
  //   await client.query<rankingLevel>(
  //     `select user_id,
  // user_name,
  // score
  // from game_farm_data where user_id = $1`,
  //     [myFriends.user_id]
  //   );
  // }

  // await client.query<rankingLevel>(
  //   `select user_id,
  // user_name,
  // score
  // from game_farm_data where user_id = $1`,
  //   []
  // );
}
