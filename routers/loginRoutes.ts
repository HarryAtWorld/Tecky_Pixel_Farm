import express from "express";
import type { Request, Response } from "express";
import { isLoggedInAPI } from "../guards";
import { userType } from "../interfaceModels";
import { client } from "../main";

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

  if (!user) {
    res.status(400).json({ success: false, message: "invalid username/password, no user" });
    return;
  }

  req.session["user"] = {
    id: user.id,
    user_name: user.user_name,
    login_account: user.login_account,
  };
  res.json({ success: true });
}

async function register(req: Request, res: Response) {
  const { user_name, login_account, login_password } = req.body;
  console.log(user_name, login_account, login_password);

  if (!user_name || !login_account || !login_password) {
    res.status(400).json({ success: false, message: "Missing Information" });
    return;
  }

  const checkAccount = await client.query(
    `SELECT * FROM user_info WHERE user_name = $1, login_account = $2`,
    [user_name, login_account]
  );

  if (!checkAccount) {
    await client.query(
      `INSERT INTO user_info (user_name, login_account, login_password) VALUES $1, $2, $3`,
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
