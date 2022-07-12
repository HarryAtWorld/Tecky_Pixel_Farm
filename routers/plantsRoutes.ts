import express from "express";
import fs from "fs"
import path from "path";

//@ts-ignore
import type { Request, Response } from "express";
//@ts-ignore
import { client } from "../main";


export const plantsRoutes = express.Router();


//provide JSON record to player
plantsRoutes.get("/", (req, res) => {
  console.log('login !received by get! Test');
  const user = req.session["user"]
  // res.json({ message: 'this will be game items json' })

  //for new player, check if json existing, if not , copy the template 
  if (!fs.existsSync(path.join(__dirname, `../gameJson/${user.id}.json`))) {
    fs.copyFileSync(path.join(__dirname, `../gameJson/template.json`), path.join(__dirname, `../gameJson/${user.id}.json`));
  }

  res.sendFile(path.join(__dirname, `../gameJson/${user.id}.json`))

  calculateScore()
});



//Update & save JSON from player
plantsRoutes.put("/", (req, res) => {

  console.log('update received by put! Test');

  console.log(Object.keys(req.body));
  const user = req.session["user"]

  // add the received time
  req.body.lastCheckingTime = Date.now()

  // const tempContent =  req.body
  // console.log(tempContent);

  let contentToWrite = JSON.stringify(req.body)
  // console.log(contentToWrite);
  fs.writeFileSync(`./gameJson/${user.id}.json`, contentToWrite, { flag: 'w' });

  res.json({ message: 'saved!' })

});


async function calculateScore() {
  const playerItemData = await client.query(
    `SELECT  
    user_info.id,
    game_farm_data.score
    FROM user_info join game_farm_data
    on user_info.id = game_farm_data.user_id `
  );

  const scoreFactor = await client.query(
    `SELECT * FROM plant_score_data `
  );

 

  let scoreFactorList = {}
// put the factor into list for later use
  for (let factor of scoreFactor.rows) {
    scoreFactorList[factor.items_name] = factor
  }






  console.log('player test', playerItemData.rows[0])


  for (let player of playerItemData.rows) {

    // let checkingTime = Date.now()
    let lastScore = player.score
    let tempScore =0

    console.log('plyer',player.id,'score',lastScore)


    let playerGameItem = JSON.parse( fs.readFileSync(`./gameJson/${player.id}.json` ,{encoding:'utf8'} )).game_item_record

    for(let gameItem in playerGameItem){

      let itemName = playerGameItem[gameItem].plantType.name
      let itemStage =playerGameItem[gameItem].stage
      let stageChangeTime =playerGameItem[gameItem].stageChangeAt

      console.log(itemName,itemStage,stageChangeTime)
      console.log(tempScore)
    }

  }


}








// plantsRoutes.get("/", calculateScore);




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

// export function calculateScore(findPlant_id: number) {
//   const create_time: any = findCreateAt(findPlant_id);
//   const timeOfDiff = diffOfTime(create_time);
//   const score = scoreLogic(timeOfDiff, findPlant_id);
//   return score;
// }

// // 基於物件items_id，然後讀取其create_time
// async function findCreateAt(findPlant_id: number) {
//   const data = await client.query(`select create_at from game_plants_data value id = $1`, [
//     findPlant_id,
//   ]);
//   return data.rows[0].create_at;
// }

// // 計算時間差距 .getTime server time － getTime create time，然後／1000 獲取秒數
// function diffOfTime(create_time: string): number {
//   let timeOfDiff = (new Date().getTime() - new Date(create_time).getTime()) / 1000;
//   return timeOfDiff;
// }

// // calculateScore logic
// // stage 1 - 1 hr ; every 10s = 1 score
// // stage 2 - 2 hr ; every 10s = 2 score
// // stage 3 - 3 hr ; every 10s = 3 score
// // stage 4 - ~ hr ; every 10s = 0 score

// // stage 1 have 3600 seconds, counting 360 times
// // stage 2 have 7200 seconds, counting 720 times
// // stage 3 have 10800 seconds, counting 1080 times

// // 計分邏輯及向database寫入stage。
// async function scoreLogic(times: number, findPlant_id: number) {
//   if (times <= 3600) {
//     await client.query(`update game_plants_data set stage = $1 where id = $2`, [1, findPlant_id]);
//     return Math.floor((times / 10) * 1);
//   } else if (times > 3600 && times <= 7200) {
//     await client.query(`update game_plants_data set stage = $1 where id = $2`, [2, findPlant_id]);
//     return Math.floor(((times - 3600) / 10) * 2 + (3600 / 10) * 1);
//   } else if (times > 7200 && times <= 10800) {
//     await client.query(`update game_plants_data set stage = $1 where id = $2`, [3, findPlant_id]);
//     return Math.floor(((times - 7200) / 10) * 3 + (7200 / 10) * 2 + (3600 / 10) * 1);
//   } else {
//     await client.query(`update game_plants_data set stage = $1 where id = $2`, [4, findPlant_id]);
//     return;
//   }
// }
