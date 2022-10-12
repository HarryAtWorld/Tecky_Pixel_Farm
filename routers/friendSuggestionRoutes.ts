import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";

export const friendSuggestion = express.Router();

friendSuggestion.get("/", getFDSuggestion);

async function getFDSuggestion(req: Request, res: Response) {
  const user = req.session["user"];
  const data_suggestion = await client.query(
    `SELECT 
    id, user_name 
    FROM user_info 
    WHERE user_info.id != $1 
    AND user_info.id NOT IN(
        select 
        user_id_b 
        from relationship 
        where user_id_a = $1
        ) AND 
        user_info.id NOT IN (
            select user_id_a 
            from relationship 
            where user_id_b = $1
            )
    ORDER BY random()
    limit 5;`,
    [user.id]
  );
 
  const resp = data_suggestion.rows;
  res.json(resp);
}
