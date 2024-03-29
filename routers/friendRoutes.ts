import express from "express";
import type { Request, Response } from "express";
import { logger } from "../main";
import { client } from "../main";

export const friendRoutes = express.Router();

friendRoutes.post("/", addFriend);
friendRoutes.delete("/", deleteFriend);

async function addFriend(req: Request, res: Response) {
  const user = req.session["user"];
  
  if (!user) {
    res.status(400).json({ success: false, message: "Not logged in" });
    return;
  }
  const { friendName } = req.body;
  logger.info(`this is friendName: ${friendName}`);

  // checking if input is empty
  if (!friendName) {
    res.status(400).json({ success: false, message: "Empty?! Who is your friend? Q_Q" });
    return;
  }

  // getting the target user_id
  const temp_friend_id = await client.query(`select id from user_info where user_name = $1`, [
    friendName,
  ]);
  logger.info(`this is friend_id: ${temp_friend_id.rows[0]}`);


  // checking if no user
  if (!temp_friend_id.rows[0]) {
    res.status(400).json({ success: false, message: "Player not found" });
    return;
  } else if (temp_friend_id.rows[0].id === user.id) {
    res.status(400).json({ success: false, message: "Don't be narcissism, that is yourself!!!" });
    return;
  } else {
    // add Friend logic start
    const friend_id = temp_friend_id.rows[0].id;

    // checking is it already fd
    const temp_checking = await client.query(
      `SELECT * FROM relationship 
      where user_id_a = $1 AND user_id_b = $2 
      OR user_id_b = $1 AND user_id_a = $2;`,
      [user.id, friend_id]
    );
    const isFdCheck = temp_checking.rows[0];
    logger.info(`this is isFdCheck: ${isFdCheck}`);

    // if not in friendship -> add friend
    if (!isFdCheck) {
      const relationship = await client.query(
        "INSERT INTO relationship (user_id_a, user_id_b) VALUES ($1, $2) RETURNING *",
        [user.id, friend_id]
      );
      logger.info(`${relationship}`);
      res.status(200).json({ success: true, message: "Friend added" });
    } else {
      res.status(400).json({ success: false, message: "Already is Friend" });
      return;
    }
  }
}

async function deleteFriend(req: Request, res: Response) {
  const user = req.session["user"];
  if (!user) {
    res.status(400).json({ success: false, message: "Not logged in" });
    return;
  }

  const friendName = req.body.friendName;
  logger.info(`deleting friend: ${friendName}`);

  // checking empty input
  if (!friendName) {
    res.status(400).json({ success: false, message: `Don't play the unfriend function!!!` });
    return;
  }

  // getting target user_id
  const unfd_id = await client.query(`select id from user_info where user_name = $1`, [friendName]);
  // logger.info(unfd_id);
  logger.info(`unfd targt user id: ${unfd_id.rows} `);


  // if no this user or input wrong name
  if (!unfd_id.rows[0]) {
    res
      .status(400)
      .json({ success: false, message: "Is it your illusion? We don't have this player." });
    return;
  } else {
    logger.info(`Start to unfriend: ${unfd_id.rows[0].id}`);

    const unFDTarget = unfd_id.rows[0].id;
    // unfd logic start
    // getting friendship info
    const friendResult = await client.query(
      `SELECT * from relationship 
      WHERE user_id_a = $1 AND user_id_b = $2 
      OR user_id_b = $1 AND user_id_a = $2`,
      [user.id, unFDTarget]
    );


    // if target is exist but not is user's friend then return
    if (!friendResult.rows[0]) {
      res
        .status(400)
        .json({ success: false, message: "...Don't ff too much, he or she is not your friend." });
      return;
    } else {
      // passed all guards , delete sql
      const unfdReturning = await client.query(
        `delete from relationship where id = $1 RETURNING *`,
        [friendResult.rows[0].id]
      );
      logger.info(` successed to unfriend: ${unfdReturning}`);
      res.status(200).json({ success: false, message: "You are friendship Slayer." });
    }
  }
}
