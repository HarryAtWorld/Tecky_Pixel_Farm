import type { Request, Response, NextFunction } from "express";
import path from "path";

export const isLoggedInStatic = (req: Request, res: Response, next: NextFunction) => {
  // [user] is relative to the HTML submission value
  if (!req.session["user"]) {
    console.log("isLoggedInMiddleware - fail");
    res.sendFile(path.join(__dirname, "Public", "404.html"));
    return;
  }
  next();
};

export const isLoggedInAPI = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session["user"]) {
    console.log("isLoggedInMiddleware - fail");
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  next();
};
