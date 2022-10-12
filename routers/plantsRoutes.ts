import express from "express";
import fs from "fs"
import path from "path";
import { logger } from "../main";
import { client } from "../main";

export const plantsRoutes = express.Router();

//provide latest Score to player
plantsRoutes.post("/", async (req, res) => {
  logger.info('requested latest score')
  
  const user = req.session["user"]
  

  const lastScoreRecord = await client.query(
    `SELECT score FROM game_farm_data where user_id = $1`, [user.id]
  );

  //add last score record to json before send to user
  let latestScore = lastScoreRecord.rows[0] 

  res.json(latestScore)

});


//provide JSON record to player
plantsRoutes.get("/", async (req, res) => {
  logger.info('player login');
  const user = req.session["user"]

  let playerGameItemRecord = JSON.parse(fs.readFileSync(path.join(__dirname, `../gameJson/${user.id}.json`), { encoding: 'utf8' }))

  const lastScoreRecord = await client.query(
    `SELECT score FROM game_farm_data where user_id = $1`, [user.id]
  );

  //add last score record to json before send to user
  playerGameItemRecord.lastScoreRecord = lastScoreRecord.rows[0]

  const userName = await client.query(
    `SELECT user_name FROM user_info where id = $1`, [user.id]
  );
  playerGameItemRecord.playerName = userName.rows[0].user_name

  const scoreFactor = await client.query(
    `SELECT * FROM plant_score_data `
  );

  let scoreFactorList = {}
  for (let factor of scoreFactor.rows) {
    scoreFactorList[factor.items_name] = factor
  }
  //add score factor to json before send to user
  playerGameItemRecord.scoreFactorList = scoreFactorList

  fs.writeFileSync(path.join(__dirname, `../gameJson/${user.id}.json`), JSON.stringify(playerGameItemRecord), { flag: 'w' });

  res.sendFile(path.join(__dirname, `../gameJson/${user.id}.json`))

});


//Update & save JSON from player
plantsRoutes.put("/", async (req, res) => {
  
  logger.info('update json received:'+`${ Object.keys(req.body)}`);
  const user = req.session["user"]

  let lastRecord = JSON.parse(fs.readFileSync(path.join(__dirname, `../gameJson/${user.id}.json`), { encoding: 'utf8' }))
  let lastCheckingTimeRecord = lastRecord.lastCheckingTime
  let lastlandCount = lastRecord.landCount

  //check land count change for reduce score
  let newLandCount = 0

  for (let x of req.body.map) {    
    for (let y in x) {
      if (x[y].tileType === 'ground') {
        newLandCount += 1
      }
    }
  }  

  let reduceScore = (newLandCount - lastlandCount) * 100
 
  if (reduceScore > 0) {
    await client.query(
      `update game_farm_data set score = score - $1 where user_id = $2 `,
      [reduceScore,user.id]
    );     
  }
 
  // add latest data to json
  req.body.lastCheckingTime = lastCheckingTimeRecord
  req.body.landCount = newLandCount

  let contentToWrite = JSON.stringify(req.body)
  // logger.info(contentToWrite);
  fs.writeFileSync(path.join(__dirname, `../gameJson/${user.id}.json`), contentToWrite, { flag: 'w' });

  res.json({ message: 'saved!' })

});
