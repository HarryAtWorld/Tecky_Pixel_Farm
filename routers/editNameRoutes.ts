import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";
import console from "console";

export const edit_name = express.Router();

edit_name.patch("/", changeName);

// routers of edit user name
async function changeName(req: Request, res: Response) {
  // get the session
  const user = req.session["user"];
  const new_name = req.body;
  console.log(user);
  const insert_new_name = new_name.user_name;

  // check user name is it already exists
  const check_same_user_name = await client.query(`select * from user_info where user_name = $1`, [
    insert_new_name,
  ]);

  if (!check_same_user_name) {
    console.log("Have same user name already");
    return;
  } else {
    // update query
    const temp_info = await client.query(
      `update user_info set user_name = $1 where id = $2 RETURNING *`,
      [insert_new_name, user.id]
    );
    // console.log(temp_info);
    const new_user_info = temp_info.rows[0];
    req.session["user"] = {
      id: new_user_info.id,
      user_name: new_user_info.user_name,
      login_account: new_user_info.login_account,
    };
    console.log(`Passed update user_info: ${new_name}`);
    console.log(req.session["user"]);
    res.status(200).json({ success: true, message: "Updated user_name successfully" });
  }
}

////////////////////////////////////////////////////////////////

// routes of edit password
// design after hashing 8/7 11:51 remarks
