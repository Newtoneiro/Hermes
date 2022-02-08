const express = require("express");
const cors = require("cors")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const db = require('./database');
const app = express();
const jwtDecode = require('jwt-decode');
const jwt = require('express-jwt');
require('dotenv').config()

const {
  createToken,
} = require('./utils');

app.use(express.json())
app.use(
  cors({
    origin: "*",
  })
)

const requireAdmin = (res, res, next) => {
  const {role} = req.user;
  if (role !== 'admin'){
    return res.status(401).json({message: 'insufficient role'})
  }
}

const attachUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token){
    return res.status(401).json({message: 'Authentication required'})
  }
  const decodedToken = jwtDecode(token.slice(7));

  if(!decodedToken){
    return res.status(401).json({message: 'There was a problem with authorization'})
  }
  else{
    req.user = decodedToken;
    next();
  }
}

const checkJwt = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
})

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
  const response = await db.promise().query(`SELECT * FROM USERS WHERE username = '${username}'`)
  if (response[0][0]){
    if (bcrypt.compareSync(password, response[0][0].password)){
      const userInfo = {id: response[0][0].user_id, email: response[0][0].email, username: response[0][0].username, role: response[0][0].role}
      const token = createToken(userInfo);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      res.json({
        result: 0,
        token,
        userInfo,
        expiresAt
      });
    }
    else{
      res.send({result: -2})
    }
  }
  else{
    res.send({result: -1})
  }
})

// Authorized requests from now on
app.use(attachUser)

app.post('/users/find', checkJwt, async (req, res) => {
  const {text} = req.body;
  var response = await db.promise().query(`SELECT * FROM USERS WHERE username like '${text}%'`)
  const data = response[0].map(user => ({username: user.username, user_id: user.user_id}))
  res.send(data)
})