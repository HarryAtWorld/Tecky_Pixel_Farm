import express from "express";
import type { Request, Response } from "express";
import { logger } from "../main";
import { client } from "../main";


export const edit_name = express.Router();

edit_name.patch("/", changeName);

// routers of edit user name
async function changeName(req: Request, res: Response) {
  // get the session
  const user = req.session["user"];
  if (!user) {
    res.status(400).json({ success: false, message: "Not logged in" });
    return;
  }

  const new_name = req.body;

  logger.info(`plyer's new_name : ${new_name.user_name} `);

  if (!new_name.user_name) {
    logger.info(`input is empty`);
    res.status(400).json({ success: false, message: "Please Enter new name!!" });
    return;
  }
  const insert_new_name = new_name.user_name;
  // check user name is it already exists
  const check_same_user_name = await client.query(`select * from user_info where user_name = $1`, [
    insert_new_name,
  ]);
  
  if (!check_same_user_name.rows[0]) {
    // update query
    const temp_info = await client.query(
      `update user_info set user_name = $1 where id = $2 RETURNING *`,
      [insert_new_name, user.id]
    );

    const new_user_info = temp_info.rows[0];
    req.session["user"] = {
      id: new_user_info.id,
      user_name: new_user_info.user_name,
      login_account: new_user_info.login_account,
    };

    res.status(200).json({ success: true, message: "Updated user_name successfully" });
  } else {
    logger.info("Have same user name already");
    res.status(400).json({ success: false, message: "User name already exists" });
    return;
  }
}