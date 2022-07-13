import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";

export const friendSuggestion = express.Router();

friendSuggestion.get("/", getFDSuggestion);

async function getFDSuggestion(req: Request, res: Response) {
  const data_suggestion = await client.query(`SELECT 
    id, user_name 
    FROM user_info 
    WHERE user_info.id != 4 
    AND user_info.id != (
        select 
        user_id_b 
        from relationship 
        where user_id_a = 4
        ) AND 
        user_info.id != (
            select user_id_a 
            from relationship 
            where user_id_b = 4
            )
    ORDER BY random()
    limit 5;`);
  console.log(`This is data of fd suggestion`);
  console.log(data_suggestion.rows);

  const resp = data_suggestion.rows;
  res.json(resp);
}
