# Route handers list

## Leading Page (index)

(BE)

-   [x] express static - Public file
-   [x] isLoggedIn logic to lock the private
-   [x] app.use 404
-   [x] listening port 8080

---

## Login Routes

(BE)

-   [x] login routes
    -   [x] req.body from form submission
    -   [x] check is it empty data
    -   [x] SQL query check user_info table login_account = $1 [login_account]
    -   [x] if !user -> res.static 400
    -   [x] res.static 200 OK
    -   [x] req.session["user"]

---

## guards

(BE)

-   [x] req.session["user"]
    -   [x] !req.session["user"] -> login failed

---

## Register Routes

(BE)

-   [x] req.body from form submission [ user_name, login_account, login_password ]

    -   [x] if any empty data -> 400

    -   [x] sql query check user_info table user_name = $1, login_account = $2 [user_name, login_account] -> 400

    -   [x] Insert to sql

---

## ranking routes

(BE)

-   [x] All player ranking

    -   [x] sql query game_farm_data oder by DESC LIMIT 10
    -   [x] res.json()

(FE)

-   [ ] fetch '/allPlayerRank', method get

    -   [ ] await resp.json()
    -   [ ] for of html div

&

(BE)

-   [ ] Friend ranking routes
    -   [x] session.user.id
    -   [x] sql query select relationship where user_id_a = $1 || user_id_b = $1, [session.user.id]
    -   [ ] query result -> for of -> select user_id, score, name from game_farm_data
    -   [ ] res.json()

(FE)

-   [ ] fetch '/friendRank', method get
    -   [ ] await resp.json()
    -   [ ] for of html div

# Testing result

```ts
////////////////////////////////
const testing = await client.query(`select create_at from user_info`)
console.log(testing.rows)
// return
// [
//   { create_at: 2022-07-05T14:27:27.100Z },
//   { create_at: 2022-07-05T14:27:27.100Z },
//   { create_at: 2022-07-05T14:27:27.100Z },
//   { create_at: 2022-07-06T04:25:44.049Z },
//   { create_at: 2022-07-06T04:25:44.049Z },
//   { create_at: 2022-07-06T04:25:44.049Z }
// ]
console.log(testing.rows[0].create_at)
// return 2022-07-05T14:27:27.100Z
const create_at = testing.rows[0].create_at
const diffOfTime = (new Date().getTime() - new Date(create_at).getTime()) / 1000
console.log(`${diffOfTime} s`)
// return as 91953.403 seconds
////////////////////////////////
```
