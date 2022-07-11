import express from "express";
import { Request, Response } from "express";

export const logoutRoute = express.Router();

logoutRoute.get("/", logout);

async function logout(req: Request, res: Response) {
  req.session["user"] = null;
  res.status(200).json({ success: true, message: "Logged out" }).redirect("./index.html");
}
