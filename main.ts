import express from "express";
//@ts-ignore
import type { Request, Response, NextFunction } from "express";
import expressSession from "express-session";
import path from "path";
//@ts-ignore
import { isLoggedInStatic } from "./guards";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

// SQL Client
export const dbClient = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
dbClient.connect();

const app = express();
// For json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// print the access massage
app.use((req, res, next) => {
  console.log(`ip: ${req.ip} accessed the path: ${req.path} by method: ${req.method}`);
  next();
});

// setup Cookies to User
app.use(
  expressSession({
    secret: "Apple KFC",
    resave: true,
    saveUninitialized: true,
    name: "Cookie for Pixel Farm",
  })
);

app.get("/c", (req, res) => {
  if (req.session["name"]) {
    res.send(`Welcome back to Pixel Farm, ${req.ip}.`);
  } else {
    req.session[`name`] = req.ip;
    res.send(`You are 1st time come here,${req.ip}. `);
  }
});

// express Static
app.use(express.static(path.join(__dirname, "Public")));
// logic for check login but some error that can not load the 404 page anymore.
// app.use(isLoggedInStatic, express.static(path.join(__dirname, "Private")));

// !!!404 Not Fund Page, must be the last handler !!!
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

// set the port number
const port = 8080;

// set up listener
app.listen(port, () => {
  console.log(`server started, Port: ${port}`);
});
