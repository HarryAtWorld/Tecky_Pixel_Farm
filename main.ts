import express from "express";
//@ts-ignore
import type { Request, Response, NextFunction } from "express";
import expressSession from "express-session";
import path from "path";
// @ts-ignore
import { isLoggedInStatic } from "./guards";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

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

// Router handler
import { loginRoutes } from "./routers/loginRoutes";
app.use(loginRoutes);
import { rankingRoutes } from "./routers/rankingRoutes";
app.use(rankingRoutes);

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
