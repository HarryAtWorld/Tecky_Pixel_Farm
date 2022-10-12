import express from "express";
import expressSession from "express-session";
import path from "path";
import winston from 'winston';
import { isLoggedInStatic } from "./guards";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

import { calculateScore } from "./scoreCalculation";

// SQL Client
export const client = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
client.connect();


export const logFormat = winston.format.printf(function(info) {
  let date = new Date().toISOString();
  return `${date}[${info.level}]: ${info.message}\n`;
});
export const logger = winston.createLogger({
  level:"info",
  format:winston.format.combine(
      winston.format.colorize(),
      logFormat
    ),
  transports:[
      new winston.transports.Console()
  ]
});

const app = express();
// For json size
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
  logger.info(`ip: ${req.ip} accessed the path: ${req.path} by method: ${req.method}`);
  next();
});

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
// edit_name
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

//regular calculate the score.
setInterval(calculateScore, 10000);

const port = 8080;
app.listen(port, () => {
  logger.info(`server started, http://localhost:${port}`);
});
