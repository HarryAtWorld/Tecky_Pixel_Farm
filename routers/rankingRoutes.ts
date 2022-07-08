import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";

export const rankingRoutes = express.Router();

rankingRoutes.get("/", allPlayerRank);

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
