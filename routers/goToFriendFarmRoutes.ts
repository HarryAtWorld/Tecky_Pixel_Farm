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
  res
    .status(400)
    .json({ success: true })
    .sendFile(path.join(__dirname, `../gameJson/${user_id.id}.json`));
}
