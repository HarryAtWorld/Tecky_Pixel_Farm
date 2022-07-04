import express from "express";
// import type { Request, Response, NextFunction } from "express";
import expressSession from "express-session";
import path from "path";

const app = express();

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

// !!!404 Not Fund Page, must be the last handler !!!
app.use((req, res) => {
  res.redirect("404.html");
});

// express Static
app.use(express.static(path.join(__dirname, "Public")));

// set the port number
const port = 8080;

// set up listener
app.listen(port, () => {
  console.log(`server started, Port: ${port}`);
});
