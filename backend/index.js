const express = require("express");
const db = require('./database');
const app = express();
const cors = require("cors")

app.use(express.json())
app.use(
  cors({
    origin: "*",
  })
)

app.listen(8080, () => {
    console.log(`App running on 8080`);
})

app.get('/', (req, res)=> {
    res.sendStatus(200);
})

app.post('/addUser', (req, res) => {
    const {username, password} = req.body
    db.promise().query(`INSERT INTO USERS (user_id, username, password) VALUES ('abc', '${username}', '${password}')`)
    res.sendStatus(200);
})
