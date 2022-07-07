import express from "express";
import type { Request, Response } from "express";
import { isLoggedInAPI } from "../guards";
import { userType } from "../interfaceModels";
import { client } from "../main";
import console from "console";

export const loginRoutes = express.Router();

// method: POST, path pattern: /login
loginRoutes.post("/login", login);
loginRoutes.post("/register", register);
loginRoutes.get("/users/info", isLoggedInAPI, getUserInfo);

async function login(req: Request, res: Response) {
  const { login_account, login_password } = req.body;
  console.log(login_account, login_password);
  if (!login_account || !login_password) {
    res.status(400).json({ success: false, message: "invalid username/password" });
    return;
  }

  const user = (
    await client.query<userType>(
      /*sql */ `
  SELECT * FROM user_info
  WHERE login_account = $1 AND login_password = $2`,
      [login_account, login_password]
    )
  ).rows[0];

  // //////////////////////////////// testing functions //////////////////
  // const testing = await client.query(`select create_at from user_info`);
  // console.log(testing.rows);
  // // return
  // // [
  // //   { create_at: 2022-07-05T14:27:27.100Z },
  // //   { create_at: 2022-07-05T14:27:27.100Z },
  // //   { create_at: 2022-07-05T14:27:27.100Z },
  // //   { create_at: 2022-07-06T04:25:44.049Z },
  // //   { create_at: 2022-07-06T04:25:44.049Z },
  // //   { create_at: 2022-07-06T04:25:44.049Z }
  // // ]
  // console.log(testing.rows[0].create_at); // 2022-07-05T14:27:27.100Z
  // const create_at = testing.rows[0].create_at;
  // const diffOfTime = (new Date().getTime() - new Date(create_at).getTime()) / 1000;
  // console.log(`${diffOfTime} s`); // return as seconds
  // ////////////////////////////////////////////////////////////////////
  if (!user) {
    res.status(400).json({ success: false, message: "invalid username/password" });
    return;
  }

  req.session["user"] = {
    id: user.id,
    user_name: user.user_name,
    login_account: user.login_account,
  };
  res.json({ success: true, message: "Login successful, Welcome" });
}

async function register(req: Request, res: Response) {
  const { user_name, login_account, login_password } = req.body;
  console.log(user_name, login_account, login_password);

  if (!user_name || !login_account || !login_password) {
    res.status(400).json({ success: false, message: "Missing Information" });
    return;
  }
  console.log(`passed check empty`);

  const checkAccount = await client.query(
    `SELECT * FROM user_info WHERE user_name = $1 AND login_account = $2`,
    [user_name, login_account]
  );
  console.log(`passed checkAccount, result: ${checkAccount.rows[0]}`);

  if (checkAccount.rows[0] === undefined) {
    await client.query(
      `INSERT INTO user_info (user_name, login_account, login_password) VALUES ($1, $2, $3)`,
      [user_name, login_account, login_password]
    );
    res.status(200).json({ success: true, message: "Account created successfully" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "username or email already existed, Try Again" });
  }
}

export async function getUserInfo(req: Request, res: Response) {
  try {
    const user = req.session["user"];
    const { id, ...others } = user;
    res.json({ success: true, user: others });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
}
