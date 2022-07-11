import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";
import { hashingPassword } from "../hashing";
import console from "console";

export const edit_password = express.Router();

edit_password.patch("/", changePassword);

function changePassword(req: Request, res: Response) {
  const user = req.session["user"];
  if (!user) {
    return;
  }
  const new_password = req.body;
  console.log(`this is new_password`);
  console.log(new_password);
  const insert_new_name = new_password.password;
  console.log(`this is insert_new_name`);
  console.log(insert_new_name);
  if (!insert_new_name) {
    res.status(400).json({ message: "Please enter a new password" });
    return;
  } else {
    const hashedPassword = hashingPassword(insert_new_name);
    client.query(`update user_info set login_password = $1 where id = $2`, [
      hashedPassword,
      user.id,
    ]);
    res.status(200).json({ message: "Password updated successfully " });
  }
}
