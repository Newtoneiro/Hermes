const express = require("express");
const cors = require("cors")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
// const db = require('./database');
const app = express();
const jwtDecode = require('jwt-decode');
const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
const io = require("socket.io")(3001, {
  cors: {
    origin: ["http://localhost:3000"]
  }
});

const csrf = require('csurf');
const csrfProtection = csrf({
  cookie: true
});

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
  app.use(cookieParser());
  
//
  const mongoose = require('mongoose');
  const User = require('./Models/user')
  const Friendship = require('./Models/friendship')
  const FriendshipRequest = require('./Models/friendship_request')
  const Message = require('./Models/message')
  
  mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@hermes.bnfuz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {useNewUrlParser: true}, () => {
    console.log('Connected to mongoDB')
  })
//

const requireAdmin = (req, res, next) => {
  const {role} = req.user;
  if (role !== 'admin'){
    return res.status(401).json({message: 'insufficient role'})
  }
  next();
}

const attachUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token){
    return res.status(401).json({message: 'Authentication required'})
  }
  const decodedToken = jwtDecode(token);

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
  ignoreExpiration: true,
  algorithms: ['HS256'],
  getToken: req => req.cookies.token
})

app.listen(8080, () => {
    console.log(`App running on 8080`);
})

app.get('/', (req, res)=> {
    res.sendStatus(200);
})

app.post('/api/users/register', async (req, res) => {
  const {username, email, password, confirm_password} = req.body;
  const response = await User.findOne({ username: username })
  if (response === null){
    const response = await User.findOne({ email: email })
    if (response === null){
      let id = uuid.v4();
      let hash = bcrypt.hashSync(password, 8);
      const new_user = new User({
        user_id : id,
        username: username,
        email: email,
        password: hash,
        role: 'user',
      })
      new_user.save().then(() => {
        res.send({result: 0});
      })
    }
    else{
      res.send({result: -2});
    }
  }
  else{
    res.send({result: -1});
  }
})

app.post('/api/users/verify', async (req, res) => {
  const {username, password} = req.body;
  const response = await User.findOne({ username: username })
  if (response !== null){
    if (bcrypt.compareSync(password, response.password)){
      const userInfo = {id: response.user_id, email: response.email, username: response.username, role: response.role}
      const token = createToken(userInfo);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      res.cookie('token', token, {
        httpOnly: true
      })

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
app.use(attachUser);
app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({csrfToken: req.csrfToken()});
})

app.post('/api/users/find', checkJwt, async (req, res) => {
  const user_id = req.user.id;
  const {text} = req.body;
 
  var friendship1 = await Friendship.find({user1_id: user_id})
  friendship1 = friendship1.map((friendship) => {return friendship.user2_id})
  var friendship2 = await Friendship.find({user2_id: user_id})
  friendship2 = friendship2.map((friendship) => {return friendship.user1_id})
  var friend_ids = friendship1.concat(friendship2)
  
  var response = await User.find(
    {$and: 
      [
        {username: {$regex: new RegExp(`^${text}`)}}, 
        {$and: 
          [
            {user_id: {$ne: user_id}}, 
            {user_id: {$nin: friend_ids}}
          ]
        }
      ]
    })
  // var response = await db.promise().query(`SELECT * FROM USERS WHERE username like '${text}%' and user_id != '${user_id}' and username not in
  // (select username from friendships join users on (user1_id = user_id) where user2_id = '${user_id}') and username not in
  // (select username from friendships join users on (user2_id = user_id) where user1_id = '${user_id}') ORDER BY username;`)
  const data = response.map(user => ({username: user.username, user_id: user.user_id}))
  res.send(data)
})

app.post('/api/users/sendFriendRequest', checkJwt, async (req, res) => {
  const {user_id} = req.body;
  const sender_id = req.user.id;
  var response = await FriendshipRequest.find({$or: [{$and: [{user1_id: sender_id}, {user2_id: user_id}]}, {$and: [{user2_id: sender_id}, {user1_id: user_id}]}]})
  // var response = await db.promise().query(`SELECT * FROM friendships_requests WHERE (user1_id = '${sender_id}' and user2_id = '${user_id}')
  // or (user1_id = '${user_id}' and user2_id = '${sender_id}');`)
  if (response.length === 0){
    let id = uuid.v4();
    const new_friendship_request = new FriendshipRequest({
      friendships_requests_id: id,
      user1_id: sender_id,
      user2_id: user_id,
    })
    new_friendship_request.save().then(() => {
      res.send({result: 0});
    })
  }
  else{
    res.send({result: -1});
  }
})

app.get('/api/users/getRequests', checkJwt, async (req, res) => {
  const user_id = req.user.id;
  try{
    var requests = await FriendshipRequest.find({user2_id: user_id})
    const result = await Promise.all(requests.map(async (request) => {
      const user = await User.findOne({user_id: request.user1_id})
      return {friendships_requests_id: request.friendships_requests_id, user1_id: request.user1_id, username: user.username}
    }))
    // var response = await db.promise().query(`SELECT friendships_requests_id, user1_id, username FROM friendships_requests join users on (user1_id = user_id) WHERE (user2_id = '${user_id}')`)
    res.send({result: result, status: 0});
  }
  catch (err){
    console.log(err)
    res.send({status: -1})
  }
})

app.post('/api/users/declineRequest', checkJwt, async(req, res) => {
  const {req_id} = req.body;
  try{
    // await db.promise().query(`DELETE FROM friendships_requests WHERE friendships_requests_id = '${req_id}'`)
    FriendshipRequest.deleteOne({friendships_requests_id: req_id}, function(err){
      if (err){
        console.log('There was an error declining the request')
        res.send({result: -1})
      }
    })
    res.send({result: 0})
  }
  catch (err){
    console.log(err)
    res.send({result: -1})
  }
})

app.post('/api/users/acceptRequest', checkJwt, async(req, res) => {
  const {req_id} = req.body;
  try{
    // var request = await db.promise().query(`SELECT * FROM friendships_requests WHERE friendships_requests_id = '${req_id}'`)
    var request = await FriendshipRequest.findOne({friendships_requests_id: req_id})
    let id = uuid.v4();

    // await db.promise().query(`INSERT INTO friendships (friendships_id, user1_id, user2_id) VALUES ('${id}', '${request[0][0].user1_id}', '${request[0][0].user2_id}')`)
    const new_friendship = new Friendship({
      friendships_id: id,
      user1_id: request.user1_id,
      user2_id: request.user2_id
    })
    new_friendship.save().then(() => {
      // await db.promise().query(`DELETE FROM friendships_requests WHERE friendships_requests_id = '${req_id}'`)
      FriendshipRequest.deleteOne({friendships_requests_id: req_id}, function(err){
        if (err){
          console.log('There was an error removing the request')
          res.send({result: -1})
        }
      })
      res.send({result: 0})
    })
  }
  catch (err){
    console.log(err)
    res.send({result: -1})
  }
})

app.get('/api/users/getFriends', checkJwt, async (req, res) => {
  const user_id = req.user.id;
  try{
    // var response = await db.promise().query(`SELECT * FROM 
    //                                             ((SELECT friendships_id, user2_id as friend_id, username 
    //                                             FROM friendships join users on (user2_id = user_id)
    //                                             WHERE (user1_id = '${user_id}'))
    //                                          UNION
    //                                             (SELECT friendships_id, user1_id as friend_id, username 
    //                                             FROM friendships join users on (user1_id = user_id)
    //                                             WHERE (user2_id = '${user_id}'))) combined
    //                                           ORDER BY username`);
    var friends1 = await Friendship.find({
      user1_id: user_id,
    })
    friends1 = await Promise.all(friends1.map(async (friend) => {
      var user = await User.findOne({user_id: friend.user2_id})
      return {friendships_id: friend.friendships_id, friend_id: friend.user2_id, username: user.username}
    }))
    var friends2 = await Friendship.find({
      user2_id: user_id,
    })
    friends2 = await Promise.all(friends2.map(async (friend) => {
      var user = await User.findOne({user_id: friend.user1_id})
      return {friendships_id: friend.friendships_id, friend_id: friend.user2_id, username: user.username}
    }))
    
    res.send({result: friends1.concat(friends2), status: 0});
  }
  catch (err){
    console.log(err)
    res.send({status: -1})
  }
})

app.post('/api/messages/get', async (req, res) => {
  const {room} = req.body
  const result = await Message.find({room_id: room})
  result.sort((a, b) => (a.timestamp > b.timestamp) ? 1: -1)
  res.send({result: result, status: 0})
})

// Socket stuff

io.on("connection", socket => {
  socket.on('send-message', (message, room) => {
    let id = uuid.v4();
    const new_message = new Message({
      message_id: id,
      room_id: room,
      sender_id: message.sender_id,
      text: message.text,
      timestamp: performance.now()
    })
    new_message.save().then(() => {
      io.in(room).emit("receive-message", new_message)
    })
  })

  socket.on("join-room", room => {
    socket.join(room)
  })

  socket.on("leave-room", room => {
    socket.leave(room)
  })
})