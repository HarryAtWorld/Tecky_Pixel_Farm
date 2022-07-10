import express from "express";
import type { Request, Response } from "express";
import { client } from "../main";

export const edit_name = express.Router();

edit_name.patch("/", changeName);

// routers of edit user name
async function changeName(req: Request, res: Response) {
  // get the session
  const user = req.session["user"];
  const new_name = req.body;
  console.log(user);
  // const result = client.query(`select * from user_info where id = $1`,[
  //     user.id
  // ])

  // check if no cookies no action
  if (!user) {
    return;
  }

  // check user name is it already exists
  const check_same_user_name = await client.query(`select * from user_info where name = $1`, [
    new_name,
  ]);

  if (!check_same_user_name) {
    return;
  } else {
    // update query
    await client.query(`update user_info set name = $1 where id = $2`, [new_name, user.id]);
    console.log(`Passed update user_info: ${new_name}`);
    res.status(200).json({ success: true, message: "Updated user_name successfully" });
  }
}

////////////////////////////////////////////////////////////////

// routes of edit password
// design after hashing 8/7 11:51 remarks
