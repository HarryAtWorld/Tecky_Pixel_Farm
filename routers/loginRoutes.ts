import express from "express";
import type { Request, Response } from "express";
import { isLoggedInAPI } from "../guards";
import { client } from "../main";
import console from "console";
import { hashingPassword, checkPassword } from "../hashing";
import fs from 'fs';
import path from 'path';

export const loginRoutes = express.Router();

// method: POST, path pattern: /login
// loginRoutes.get("/login/google", loginGoogle);
loginRoutes.get("/login", loginPage);
loginRoutes.post("/login", login);
loginRoutes.post("/register", register);
loginRoutes.get("/users/info", isLoggedInAPI, getUserInfo);

function loginPage(req: Request, res: Response) {
  res.redirect("./login.html");
}

async function login(req: Request, res: Response) {
  // getting user login input
  const { login_account, login_password } = req.body;
  console.log(login_account, login_password);
  // empty checking
  if (!login_account || !login_password) {
    res.status(400).json({ success: false, message: "invalid username/password" });
    return;
  }
  // select from sql by login_account, getting all information
  const user = (
    await client.query(
      /*sql */ `
  SELECT * FROM user_info
  WHERE login_account = $1`,
      [login_account]
    )
  ).rows[0];

  // if no result -> not yet register -> return
  if (!user) {
    res.status(400).json({ success: false, message: "invalid username/password" });
    return;
  }

  // checking password, if match -> set session
  // checking hashed password
  const match = await checkPassword(login_password, user.login_password);
  if (match) {
    req.session["user"] = {
      id: user.id,
      user_name: user.user_name,
      login_account: user.login_account,
    };
    res.json({ success: true, message: "Login successful, Welcome" });
  } else {
    // password not match -> return
    res.status(400).json({ success: false, message: "Invalid username/password" });
  }
}

async function register(req: Request, res: Response) {
  // getting input from user
  const { user_name, login_account, login_password } = req.body;
  console.log(user_name, login_account, login_password);

  // empty checking
  if (!user_name || !login_account || !login_password) {
    res.status(400).json({ success: false, message: "Missing Information" });
    return;
  }
  console.log(`passed check empty`);

  // same username or login_account checking
  const checkAccount = await client.query(
    `SELECT * FROM user_info WHERE user_name = $1 OR login_account = $2`,
    [user_name, login_account]
  );
  console.log(`passed checkAccount, result: ${checkAccount.rows[0]}`);

  // if passed guards -> insert data into database -> create new account
  if (checkAccount.rows[0] === undefined) {
    // hashing password
    const hashedPassword = await hashingPassword(login_password);
    const data = await client.query(
      `INSERT INTO user_info (user_name, login_account, login_password) VALUES ($1, $2, $3) RETURNING id`,
      [user_name, login_account, hashedPassword]
    );
    const temp_ac = data.rows[0].id;

    //for new player, check if json existing, if not , copy the template 
    if (!fs.existsSync(path.join(__dirname, `./gameJson/${temp_ac}.json`))) {
      let templateJson = JSON.parse(fs.readFileSync(`./gameJson/template.json`, { encoding: 'utf8' }))
      templateJson.lastCheckingTime = Date.now()
      templateJson.landCount = 1
      fs.writeFileSync(`./gameJson/${temp_ac}.json`, JSON.stringify(templateJson), { flag: 'w' });
    }

    // console.log(`passed temp_ac, result: ${temp_ac}`);
    //@ts-ignore
    const createPlayerData = await client.query(
      `Insert into game_farm_data (user_id)
      VALUES ($1) RETURNING *`,
      [temp_ac]
    );
    console.log(`created playerData`);
    console.log(createPlayerData);

    res.status(200).json({ success: true, message: "Account created successfully" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "username or email already existed, Try Again" });
  }
}

// google login function
// async function loginGoogle(req: express.Request, res: express.Response) {
//   const accessToken = req.session?.["grant"].response.access_token;
//   const fetchRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
//     method: "get",
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   const result = await fetchRes.json();
//   console.log(result);
//   const users = (
//     await client.query(`SELECT * FROM user_info WHERE login_account = $1`, [result.email])
//   ).rows;
//   let user = users[0];
//   if (!user) {
//     // Create the user when the user does not exist
//     user = (
//       await client.query(
//         `INSERT INTO user_info (login_account,login_password)
//                 VALUES ($1,$2) RETURNING *`,
//         [result.email, 1234]
//       )
//     ).rows[0];
//   }
//   if (req.session) {
//     req.session["user"] = {
//       id: user.id,
//     };
//   }
//   return res.redirect("/");
// }

export async function getUserInfo(req: Request, res: Response) {
  try {
    const user = req.session["user"];
    const { id, ...others } = user;
    res.json({ success: true, user: others });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
}
