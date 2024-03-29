import express from "express";
import type { Request, Response } from "express";
import { logger } from "../main";
import { client } from "../main";
import { hashingPassword } from "../hashing";


export const edit_password = express.Router();

edit_password.patch("/", changePassword);

async function changePassword(req: Request, res: Response) {
  const user = req.session["user"];
  if (!user) {
    return;
  }
  const new_password = req.body;
  logger.info(`new_password received`);

  const insert_new_password = new_password.login_password;

  const hashedPassword = await hashingPassword(insert_new_password);
  if (!insert_new_password) {
    res.status(400).json({ message: "Please enter a new password" });
    return;
  } else {
    client.query(`update user_info set login_password = $1 where id = $2`, [
      hashedPassword,
      user.id,
    ]);
    res.status(200).json({ message: "Password updated successfully " });
  }
}
