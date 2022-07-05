import express from "express";
import type { Request, Response } from "express";
import { isLoggedInAPI } from "../guards";
import { userType } from "../interfaceModels";
import { client } from "../main";

export const loginRoutes = express.Router();

// method: POST, path pattern: /login
loginRoutes.post("/login", login);
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
    res.status(400).json({ success: false, message: "invalid username/password" });
    return;
  }

  req.session["user"] = { id: user.id, username: user.username };
  res.json({ success: true });
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
