import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";
import { hashingPassword } from "../hashing";

export const edit_password = express.Router();

edit_password.patch("/", changePassword);

function changePassword(req: Request, res: Response) {
  const user = req.session["user"];
  if (!user) {
    return;
  }
  const new_password = req.body;
  if (!new_password) {
    res.status(400).json({ message: "Please enter a new password" });
    return;
  } else {
    const hashedPassword = hashingPassword(new_password);
    client.query(`update user_info set login_password = $1 where id = $2`, [
      hashedPassword,
      user.id,
    ]);
    res.status(200).json({ message: "Password updated successfully " });
  }
}
