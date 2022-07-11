import express from "express";
import type { Request, Response } from "express";

export const userinfoRoutes = express.Router();

userinfoRoutes.get("/", my_info);

function my_info(req: Request, res: Response) {
  const myData = req.session["user"];
  //   console.log(`enter into my_info getting user info`);
  //   console.log(myData);
  //   console.log(myData.id);
  //   console.log(myData.user_name);
  //   console.log(myData.login_account);
  res.json(myData);
}
