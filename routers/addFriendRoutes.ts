//@ts-ignore
import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";
import console from "console";

export const friendRoutes = express.Router();

friendRoutes.post("/", addFriend);

async function addFriend(req: Request, res: Response) {
  const user = req.session["user"];
  console.log(user.id);
  if (!user) {
    res.status(400).json({ success: false, message: "Not logged in" });
    return;
  }
  const { friendName } = req.body;
  console.log(`this is friendName`);
  console.log(friendName);

  // checking if input empty
  if (!friendName) {
    res.status(400).json({ success: false, message: "Empty?! Who is your friend? Q_Q" });
    return;
  }

  const temp_friend_id = await client.query(`select id from user_info where user_name = $1`, [
    friendName,
  ]);
  console.log(`this is friend_id`);
  console.log(temp_friend_id.rows[0].id);
  const friend_id = temp_friend_id.rows[0].id;
  if (!friend_id) {
    res.status(400).json({ success: false, message: "Player not found" });
    return;
  } else {
    const temp_checking = await client.query(
      `SELECT * FROM relationship where user_id_a = $1 AND user_id_b = $2 OR user_id_b = $1 AND user_id_a = $2;`,
      [user.id, friend_id]
    );
    const isFdCheck = temp_checking.rows[0];
    console.log(`this is isFdCheck`);
    console.log(isFdCheck);
    if (!isFdCheck) {
      const relationship = await client.query(
        "INSERT INTO relationship (user_id_a, user_id_b) VALUES ($1, $2) RETURNING *",
        [user.id, friend_id]
      );
      console.log(relationship);
      res.status(200).json({ success: true, message: "Friend added" });
    } else {
      res.status(400).json({ success: false, message: "Already is Friend" });
      return;
    }
  }
}
