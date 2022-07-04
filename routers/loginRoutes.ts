import express from "express";
//@ts-ignore
import type { Request, Response, NextFunction } from "express";
import { isLoggedInAPI } from "../guards";
import { userType } from "../interfaceModels";
import { dbClient } from "../main";

export const loginRoutes = express.Router();

// method: POST, path pattern: /login
loginRoutes.post("/login", login);
loginRoutes.get("/users/info", isLoggedInAPI, getUserInfo);

async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) {
    res.status(400).json({ success: false, message: "invalid username/password" });
    return;
  }

  const user = (
    await dbClient.query<userType>(
      /*sql */ `
  SELECT * FROM users
  WHERE username = $1 AND password = $2`,
      [username, password]
    )
  ).rows[0];

  if (!user) {
    res.status(400).json({ success: false, message: "invalid username/password" });
    return;
  }

  req.session["user"] = { id: user.id, username: user.username };
  res.json({ success: true });
}

async function getUserInfo(req: Request, res: Response) {
  try {
    const user = req.session["user"];
    const { id, ...others } = user;
    res.json({ success: true, user: others });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
}
