import express from "express";
//@ts-ignore
import type { Request, Response } from "express";
//@ts-ignore
import { client } from "../main";

export const plantsRoutes = express.Router();

// plantsRoutes.get("/", getGameData);

// async function getGameData(req: Request, res: Response) {
//   const gameJsonDataFromFE = req.body;
// }

// const user = req.session["user"];
// const gameDataFromSQL = await client.query(
//   `SELECT * FROM
//   game_farm_data
//   join user_id on game_farm_data.user_id = user_id
//   WHERE user_id = $1`,
//   [user.id]
// );

export function calculateScore(findPlant_id: number) {
  const create_time: any = findCreateAt(findPlant_id);
  const timeOfDiff = diffOfTime(create_time);
  const score = scoreLogic(timeOfDiff, findPlant_id);
  return score;
}

function diffOfTime(create_time: string): number {
  let timeOfDiff = (new Date().getTime() - new Date(create_time).getTime()) / 1000;
  return timeOfDiff;
}

async function findCreateAt(findPlant_id: number) {
  const data = await client.query(`select create_at from game_plants_data value id = $1`, [
    findPlant_id,
  ]);
  return data.rows[0].create_at;
}

// calculateScore logic
// stage 1 - 1 hr ; every 10s = 1 score
// stage 2 - 2 hr ; every 10s = 2 score
// stage 3 - 3 hr ; every 10s = 3 score
// stage 4 - ~ hr ; every 10s = 0 score

// stage 1 have 3600 seconds, counting 360 times
// stage 2 have 7200 seconds, counting 720 times
// stage 3 have 10800 seconds, counting 1080 times

async function scoreLogic(times: number, findPlant_id: number) {
  if (times <= 3600) {
    await client.query(`update game_plants_data set stage = $1 where id = $2`, [1, findPlant_id]);
    return Math.floor((times / 10) * 1);
  } else if (times > 3600 && times <= 7200) {
    await client.query(`update game_plants_data set stage = $1 where id = $2`, [2, findPlant_id]);
    return Math.floor(((times - 3600) / 10) * 2 + (3600 / 10) * 1);
  } else if (times > 7200 && times <= 10800) {
    await client.query(`update game_plants_data set stage = $1 where id = $2`, [3, findPlant_id]);
    return Math.floor(((times - 7200) / 10) * 3 + (7200 / 10) * 2 + (3600 / 10) * 1);
  } else {
    await client.query(`update game_plants_data set stage = $1 where id = $2`, [4, findPlant_id]);
    return;
  }
}
