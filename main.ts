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
import grant from "grant";

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
app.use(express.json());

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

const grantExpress = grant.express({
  defaults: {
    origin: "http://localhost:8080",
    transport: "session",
    state: true,
  },
  google: {
    key: process.env.GOOGLE_CLIENT_ID || "",
    secret: process.env.GOOGLE_CLIENT_SECRET || "",
    scope: ["profile", "email"],
    callback: "/login/google",
  },
});
app.use(grantExpress as express.RequestHandler);

// Router handler
import { loginRoutes } from "./routers/loginRoutes";
app.use(loginRoutes);
import { rankingRoutes } from "./routers/rankingRoutes";
app.use("/allPlayerRank", rankingRoutes);
import { friendRankRoutes } from "./routers/friendRankRoutes";
app.use("/friendRank", friendRankRoutes);
import { edit_name } from "./routers/editNameRoutes";
app.use("/edit_name", edit_name);

// express Static
app.use(express.static(path.join(__dirname, "Public")));
// logic for check login but some error that can not load the 404 page anymore.
// problem in guards.ts line 8 redirect to "/",  temporary solution is using res.sendFile(404);
app.use(isLoggedInStatic, express.static(path.join(__dirname, "Private")));

// !!!404 Not Fund Page, must be the last handler !!!
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "Public", "404.html"));
});

const port = 8080;
app.listen(port, () => {
  console.log(`server started, http://localhost:${port}`);
});
