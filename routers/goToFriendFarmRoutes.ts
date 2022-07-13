import express from "express";
import type { Request, Response } from "express";
//@ts-ignore
import fs from "fs";
import path from "path";
//@ts-ignore
import { client } from "../main";

export const goToFriendFarm = express.Router();

goToFriendFarm.get("/", goFarm);

async function goFarm(req: Request, res: Response) {
  const target = req.body;
  res.sendFile(path.join(__dirname, `../gameJson/${target.id}.json`));
}
