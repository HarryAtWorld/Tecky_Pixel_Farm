import express from "express";
//@ts-ignore
import type { Request, Response, NextFunction } from "express";
import expressSession from "express-session";
import path from "path";
// @ts-ignore
import { isLoggedInStatic } from "./guards";
import pg from "pg";
//@ts-ignore
import fetch from "cross-fetch";
import dotenv from "dotenv";
dotenv.config();
// import grant from "grant";

// import { calculateScore } from "./scoreCalculation";

// SQL Client
export const client = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
client.connect();

const app = express();
// For json
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

// setup Cookies to User
app.use(
  expressSession({
    secret: "Apple KFC",
    resave: true,
    saveUninitialized: true,
    name: "Cookie for Pixel Farm",
  })
);
// print the access massage
app.use((req, res, next) => {
  console.log(`ip: ${req.ip} accessed the path: ${req.path} by method: ${req.method}`);
  next();
});

// const grantExpress = grant.express({
//   defaults: {
//     origin: "http://localhost:8080",
//     transport: "session",
//     state: true,
//   },
//   google: {
//     key: process.env.GOOGLE_CLIENT_ID || "",
//     secret: process.env.GOOGLE_CLIENT_SECRET || "",
//     scope: ["profile", "email"],
//     callback: "/login/google",
//   },
// });
// app.use(grantExpress as express.RequestHandler);

// Router handler
// login, register
import { loginRoutes } from "./routers/loginRoutes";
app.use(loginRoutes);
// add friend routes and unfriend routes
import { friendRoutes } from "./routers/friendRoutes";
app.use("/friend", friendRoutes);
// allPlayerRank route
import { rankingRoutes } from "./routers/rankingRoutes";
app.use("/allPlayerRank", rankingRoutes);
import { userinfoRoutes } from "./routers/userInfoRoutes";
app.use("/userInfo", userinfoRoutes);
// FriendRank and show friend routers
import { friendRankRoutes } from "./routers/friendRankRoutes";
app.use("/friendRank", friendRankRoutes);
//  edit_name
import { edit_name } from "./routers/editNameRoutes";
app.use("/name", edit_name);
import { edit_password } from "./routers/editPasswordRoutes";
app.use("/password", edit_password);
import { logoutRoute } from "./routers/logoutRoutes";
app.use("/logout", logoutRoute);
import { plantsRoutes } from "./routers/plantsRoutes";
app.use("/record", plantsRoutes);
app.use("/score", plantsRoutes);
app.use("/updateItem", plantsRoutes);
// go to friend farm routes
import { goToFriendFarm } from "./routers/goToFriendFarmRoutes";
app.use("/friendFarm", goToFriendFarm);
import { friendSuggestion } from "./routers/friendSuggestionRoutes";
app.use("/friendSuggestion", friendSuggestion);
// express Static
app.use(express.static(path.join(__dirname, "Public")));
app.use(isLoggedInStatic, express.static(path.join(__dirname, "Private")));

// !!!404 Not Fund Page, must be the last handler !!!
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "Public", "404.html"));
});

// setInterval(calculateScore, 10000);

const port = 8080;
app.listen(port, () => {
  console.log(`server started, http://localhost:${port}`);
});
