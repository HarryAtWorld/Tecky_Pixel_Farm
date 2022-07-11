//@ts-ignore
import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";
import console from "console";

export const friendRoutes = express.Router();

friendRoutes.post("/", addFriend);

async function addFriend(req: Request, res: Response) {
  const user = req.session["user"];
  if (!user) {
    res.status(400).json({ success: false, message: "Not logged in" });
    return;
  }
  const { friendName } = req.body.rows[0].friendName;
  console.log(`this is friendName`);
  console.log(friendName);
  const friend_id = await client.query(`select user_name from user_info where user_name = $1`, [
    friendName,
  ]);
  if (!friend_id.rows) {
    res.status(400).json({ success: false, message: "Player not found" });
    return;
  }
  console.log(`this is friend_id`);
  console.log(friend_id);
  // assume get request to addFriend, request the 'friend' user_id
  const dataA = await client.query(
    `SELECT user_id_a from relationship where user_id_a = $1 AND user_id_b = $2`,
    [friend_id, user.user_id]
  );
  const dataB = await client.query(
    `SELECT user_id_b from relationship where user_id_a = $1 AND user_id_b = $2`,
    [user.user_id, friend_id]
  );

  if (dataA.rows[0].user_id_a === undefined || dataB.rows[0].user_id_b === undefined) {
    const relationship = await client.query(
      "INSERT INTO relationship (user_id_a, user_id_b) VALUES ($1, $2) RETURNING *",
      [user.user_id, friend_id]
    );
    console.log(relationship);
    res.status(200).json({ success: true, message: "Friend added" });
  } else {
    res.status(400).json({ success: false, message: "Already is Friend" });
    return;
  }
}
