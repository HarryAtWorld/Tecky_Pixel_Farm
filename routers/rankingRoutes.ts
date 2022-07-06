import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";
import { rankingLevel } from "../interfaceModels";
import { getUserInfo } from "./loginRoutes";

export const rankingRoutes = express.Router();

rankingRoutes.get("/allPlayerRank", allPlayerRank);
rankingRoutes.get("/friendRank", getUserInfo, friendRank);

async function allPlayerRank(req: Request, res: Response) {
  const all_player_ranking_list = await findAllPlayerRanking();
  res.json(all_player_ranking_list);
}

async function findAllPlayerRanking() {
  await client.query<rankingLevel>(`select user_id,
    user_name, 
    score
    from game_farm_data ORDER BY score DESC LIMIT 10`);
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
  const myFriends_rowB = await client.query<rankingLevel>(
    `select user_id_a
  from relationship
  where user_id_b = $1`,
    [myself.user_id]
  );
  const myFriends_rowA = await client.query<rankingLevel>(
    `select user_id_b from relationship where user_id_a = $1`,
    [myself.user_id]
  );

  console.log(myFriends_rowA, myFriends_rowB);
  // let myFriends;
  // for (let i = 0; i < myFriends.rows.length; i++) {
  //   friendData.join(
  //     await client.query(`Select * from game_farm_data where user_id = $1`, [myFriends.rows])
  //   );
  // }
}
