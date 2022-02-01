const express = require("express");
const cors = require("cors")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const db = require('./database');
const app = express();

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

app.post('/users/register', async (req, res) => {
  const {username, email, password, confirm_password} = req.body;
  const response = await db.promise().query(`SELECT COUNT(*) as count FROM USERS WHERE username = '${username}'`)
  if (response[0][0].count == 0){
    const response = await db.promise().query(`SELECT COUNT(*) as count FROM USERS WHERE email = '${email}'`)
    if (response[0][0].count == 0){
      let id = uuid.v4();
      let hash = bcrypt.hashSync(password, 8);
      db.promise().query(`INSERT INTO USERS (user_id, username, email, password) VALUES ('${id}', '${username}', '${email}', '${hash}')`)
      res.send({result: 0});
    }
    else{
      res.send({result: -2});
    }
  }
  else{
    res.send({result: -1});
  }
})

app.post('/users/verify', async (req, res) => {
  const {username, password} = req.body;
  const response = await db.promise().query(`SELECT password FROM USERS WHERE username = '${username}'`)
  if (response[0][0]){
    if (bcrypt.compareSync(password, response[0][0].password)){
      res.send({result: 0})
    }
    else{
      res.send({result: -2})
    }
  }
  else{
    res.send({result: -1})
  }


})
