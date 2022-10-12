import express from "express";
import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { logger } from "../main";
import { client } from "../main";

export const goToFriendFarm = express.Router();

goToFriendFarm.post("/", goFarm);

async function goFarm(req: Request, res: Response) {
  const { user_id } = req.body;
  logger.info(`Ready to friend's Farm`);
  
  // insert target id into session
  req.session["user"].fd_farm = user_id;

  res.status(200).json({message:'ok'});
}


//provide JSON record to player
goToFriendFarm.get("/", async (req, res) => {
  
  const user = req.session["user"]

  let playerGameItemRecord = JSON.parse(fs.readFileSync(path.join(__dirname, `../gameJson/${user.fd_farm}.json`), { encoding: 'utf8' }))

  const lastScoreRecord = await client.query(
    `SELECT score FROM game_farm_data where user_id = $1`, [user.fd_farm]
  );

  //add last score record to json before send to user
  playerGameItemRecord.lastScoreRecord = lastScoreRecord.rows[0]


  const userName = await client.query(
    `SELECT user_name FROM user_info where id = $1`, [user.fd_farm]
  );
  playerGameItemRecord.playerName = userName.rows[0]


  const scoreFactor = await client.query(
    `SELECT * FROM plant_score_data `
  );

  let scoreFactorList = {}
  for (let factor of scoreFactor.rows) {
    scoreFactorList[factor.items_name] = factor
  }
  //add score factor to json before send to user
  playerGameItemRecord.scoreFactorList = scoreFactorList

  fs.writeFileSync(path.join(__dirname, `../gameJson/${user.fd_farm}.json`), JSON.stringify(playerGameItemRecord), { flag: 'w' });

  res.sendFile(path.join(__dirname, `../gameJson/${user.fd_farm}.json`))

});