import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";

export const edit_name = express.Router();

edit_name.put("/", changeName);

// routers of edit user name
async function changeName(req: Request, res: Response) {
  // get the session
  const user = req.session["user"];
  const new_name = req.body;
  console.log(user);
  if (!user) {
    return;
  }

  // check user name is it already exists
  const check_same_user_name = await client.query(`select * from user_info where name = $1`, [
    new_name,
  ]);

  if (!check_same_user_name) {
    console.log("have same user name already");
    return;
  } else {
    // update query
    const temp_info = await client.query(
      `update user_info set name = $1 where id = $2 RETURNING *`,
      [new_name, user.id]
    );
    const new_user_info = temp_info.rows[0];
    req.session["user"] = {
      id: new_user_info.id,
      user_name: new_user_info.user_name,
      login_account: new_user_info.login_account,
    };
    console.log(`Passed update user_info: ${new_name}`);
    res.status(200).json({ success: true, message: "Updated user_name successfully" });
  }
}

////////////////////////////////////////////////////////////////

// routes of edit password
// design after hashing 8/7 11:51 remarks
