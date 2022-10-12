import express from "express";
import type { Request, Response } from "express";

export const userinfoRoutes = express.Router();

userinfoRoutes.get("/", my_info);

function my_info(req: Request, res: Response) {
  const myData = req.session["user"];
  res.json(myData);
}
