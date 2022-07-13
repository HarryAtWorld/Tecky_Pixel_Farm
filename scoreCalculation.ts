
import fs from "fs"
// import path from 'path'


//@ts-ignore
import type { Request, Response } from "express";
//@ts-ignore
import { client } from "./main";



//server update all player's score every 10second
export async function calculateScore() {
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
    console.log('regular checking!')

    // check each player of all players
    for (let player of playerItemData.rows) {

        let checkingTimeNow = Date.now()
        let lastScore = player.score
        let tempScore = 0

        let playerGameItemRecord = JSON.parse(fs.readFileSync(`./gameJson/${player.id}.json`, { encoding: 'utf8' }))
        let playerGameItem = playerGameItemRecord.game_item_record
        
        // check each item of player's items
        for (let gameItem in playerGameItem) {

            let itemName = playerGameItem[gameItem].plantType.name
            let itemStage = playerGameItem[gameItem].stage
            let itemStageChangeTime = playerGameItem[gameItem].stageChangeAt

            //check stage
            let timeDuring = Math.round((checkingTimeNow - itemStageChangeTime) / 1000)            

            // change item stage with checking
            if (timeDuring > scoreFactorList[itemName][`stage_${itemStage}_life`] && itemStage < 3) {                

                playerGameItemRecord.game_item_record[gameItem].stageChangeAt = checkingTimeNow
                playerGameItemRecord.game_item_record[gameItem].stage += 1

                console.log(itemName,gameItem,'changed stage to:', playerGameItemRecord.game_item_record[gameItem].stage)
                // console.log('changed stage to:', itemStage) //<=====why this later then above 1 loop?
                //update item 'stageChangeAt' on Json         
                fs.writeFileSync(`./gameJson/${player.id}.json`, JSON.stringify(playerGameItemRecord), { flag: 'w' });

            }

            //check how may score should be added for  this item during last 10second
            let itemScore = scoreFactorList[itemName][`stage_${playerGameItemRecord.game_item_record[gameItem].stage}_score`]
            
            if (playerGameItemRecord.game_item_record[gameItem].stage == 3) {
                continue
            }
            tempScore += itemScore
        }
        
        let newScore = lastScore + tempScore

        await client.query(
            `update game_farm_data set score = $1 where user_id = $2`,
            [newScore, player.id]
        );



        // below for server console.log use , can be deleted.
        const playerItemData2 = await client.query(
            `SELECT  
          user_info.id,
          game_farm_data.score
          FROM user_info join game_farm_data
          on user_info.id = game_farm_data.user_id `
        );
        console.log('plyer', player.id, 'now score:', playerItemData2.rows[0].score)

    }

}