import express from "express";
import type { Request, Response } from "express";
import { isLoggedInAPI } from "../guards";
import { client } from "../main";
import console from "console";
import { hashingPassword, checkPassword } from "../hashing";

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
  const { login_account, login_password } = req.body;
  console.log(login_account, login_password);
  if (!login_account || !login_password) {
    res.status(400).json({ success: false, message: "invalid username/password" });
    return;
  }
  const user = (
    await client.query(
      /*sql */ `
  SELECT * FROM user_info
  WHERE login_account = $1`,
      [login_account]
    )
  ).rows[0];
  if (!user) {
    res.status(400).json({ success: false, message: "invalid username/password" });
    return;
  }
  const match = await checkPassword(login_password, user.login_password);
  if (match) {
    req.session["user"] = {
      id: user.id,
      user_name: user.user_name,
      login_account: user.login_account,
    };
    res.json({ success: true, message: "Login successful, Welcome" });
  } else {
    res.status(400).json({ success: false, message: "Invalid username/password" });
  }
}

async function register(req: Request, res: Response) {
  const { user_name, login_account, login_password } = req.body;
  console.log(user_name, login_account, login_password);

  if (!user_name || !login_account || !login_password) {
    res.status(400).json({ success: false, message: "Missing Information" });
    return;
  }
  console.log(`passed check empty`);

  const checkAccount = await client.query(
    `SELECT * FROM user_info WHERE user_name = $1 OR login_account = $2`,
    [user_name, login_account]
  );
  console.log(`passed checkAccount, result: ${checkAccount.rows[0]}`);

  if (checkAccount.rows[0] === undefined) {
    const hashedPassword = await hashingPassword(login_password);
    await client.query(
      `INSERT INTO user_info (user_name, login_account, login_password) VALUES ($1, $2, $3)`,
      [user_name, login_account, hashedPassword]
    );
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
