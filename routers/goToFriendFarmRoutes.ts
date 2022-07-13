import express from "express";
import type { Request, Response } from "express";
//@ts-ignore
import fs from "fs";
import path from "path";
//@ts-ignore
import { client } from "../main";

export const goToFriendFarm = express.Router();

goToFriendFarm.post("/", goFarm);

async function goFarm(req: Request, res: Response) {
  const { user_id } = req.body;
  console.log(`Ready to Fd Farm`);
  console.log(user_id);
  // insert target id into session
  req.session["user"].fd_farm = user_id;
  console.log(req.session["user"]);
  res.status(200).sendFile(path.join(__dirname, `../gameJson/${user_id}.json`));
}