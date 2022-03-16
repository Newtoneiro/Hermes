require('dotenv').config()

const PORT = process.env.PORT || 8080

const express = require("express");
const cors = require("cors")
const bcrypt = require("bcrypt")
const uuid = require("uuid")
const app = express();
const jwtDecode = require('jwt-decode');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://sad-goldwasser-10179d.netlify.app"],
  })
)

const csrf = require('csurf');
const csrfProtection = csrf({
  cookie: {
            key: '_csrf',
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          }
});
app.use(csrfProtection);

var server = require('http').createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
})

server.listen(PORT, () => {
    console.log('Server listenig on port' + PORT);
})


const {
  createToken,
  requireAdmin,
  attachUser,
  checkJwt,
  encryptMessage,
  decryptMessage
} = require('./utils');
  
// DATABASE STUFF
  const mongoose = require('mongoose');
  const User = require('./Models/user')
  const Friendship = require('./Models/friendship')
  const FriendshipRequest = require('./Models/friendship_request')
  const Message = require('./Models/message')
  const GroupMembership = require('./Models/group_membership')
  const GroupInfo = require('./Models/group_info');
  const Nofification = require('./Models/notification');
  
  mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@hermes.bnfuz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {useNewUrlParser: true}, () => {
    console.log('Connected to mongoDB')
  })
//

app.get('/api/csrf-token', (req, res) => {
  res.json({csrfToken: req.csrfToken()});
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
      const userInfo = {id: response.user_id, email: response.email, username: response.username, role: response.role, image: response.image}
      const token = createToken(userInfo);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
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
  const data = response.map(user => ({username: user.username, user_id: user.user_id, image: user.image}))
  data.sort((a, b) => a.username.localeCompare(b.username))
  res.send(data)
})

app.post('/api/users/sendFriendRequest', checkJwt, async (req, res) => {
  const {user_id} = req.body;
  const sender_id = req.user.id;
  var response = await FriendshipRequest.find({$or: [{$and: [{user1_id: sender_id}, {user2_id: user_id}]}, {$and: [{user2_id: sender_id}, {user1_id: user_id}]}]})
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
    result.sort((a, b) => a.username.localeCompare(b.username))
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
    var request = await FriendshipRequest.findOne({friendships_requests_id: req_id})
    let id = uuid.v4();

    const new_friendship = new Friendship({
      friendships_id: id,
      user1_id: request.user1_id,
      user2_id: request.user2_id
    })
    new_friendship.save().then(() => {
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
    var friends1 = await Friendship.find({
      user1_id: user_id,
    })
    friends1 = await Promise.all(friends1.map(async (friend) => {
      var user = await User.findOne({user_id: friend.user2_id})
      return {friendships_id: friend.friendships_id, friend_id: friend.user2_id, username: user.username, image: user.image}
    }))
    var friends2 = await Friendship.find({
      user2_id: user_id,
    })
    friends2 = await Promise.all(friends2.map(async (friend) => {
      var user = await User.findOne({user_id: friend.user1_id})
      return {friendships_id: friend.friendships_id, friend_id: friend.user1_id, username: user.username, image: user.image}
    }))
    
    var result = friends1.concat(friends2)
    result.sort((a, b) => a.username.localeCompare(b.username))
    res.send({result: result, status: 0});
  }
  catch (err){
    console.log(err)
    res.send({status: -1})
  }
})

app.get('/api/users/notifications', checkJwt, async (req, res) => {
  const user_id = req.user.id;
  try{
    var notifications = await Nofification.find({user_id: user_id})
    notifications = notifications.map((not) => not.room_id)
    res.send({result: notifications, status: 0})
  }
  catch (err){
    console.log(err)
    res.send({status: -1})
  }
})

app.post('/api/users/createGroup', checkJwt, async (req, res) => {
  const user_id = req.user.id;
  const {members, name} = req.body
  members.push(user_id)
  let group_id = uuid.v4()
  const new_GroupInfo = new GroupInfo({
    group_name_id: uuid.v4(),
    name: name,
    group_id: group_id,
    owner_id: user_id,
  })
  try{
    await new_GroupInfo.save()
    await members.forEach(async (member) => {
      var new_groupMembership = new GroupMembership({
        group_membership_id: uuid.v4(),
        user_id: member,
        group_id: group_id
      })

      await new_groupMembership.save()
    })
    res.send({status: 0})
  }
  catch (err) {
    console.log(err)
    res.send({status: -1})
  }
})

app.get('/api/users/getGroups', checkJwt, async (req, res) => {
  const user_id = req.user.id;
  var result = await GroupMembership.find({user_id: user_id})
  result = await Promise.all(result.map(async (group) => {
    const group_info = await GroupInfo.findOne({group_id: group.group_id})
    const members = await GroupMembership.find({group_id: group.group_id})
    const ownerUsername = await User.findOne({user_id: group_info.owner_id})
    const member_icons = await Promise.all(members.map(async (member) => {
      const user = await User.findOne({user_id: member.user_id})
      return {user_id: member.user_id, image: user.image, username: user.username}
    }))
    return {...group._doc, name: group_info.name, member_icons: member_icons, owner_username: ownerUsername.username, ownerID: ownerUsername.user_id}
  }))
  res.send({result: result, status: 0})
})

app.post('/api/users/promoteGroup', checkJwt, async (req, res) => {
  const {user_id, group_id} = req.body
  try {
    await GroupInfo.findOneAndUpdate({group_id: group_id}, {owner_id: user_id})
  }
  catch (err){
    console.log(err)
    res.send({status: -1})
  }
  res.send({status: 0})
})

app.post('/api/users/removeFromGroup', checkJwt, async (req, res) => {
  const {user_id, group_id} = req.body
  try {
    await GroupMembership.findOneAndDelete({group_id: group_id, user_id: user_id})
    res.send({status: 0})
  }
  catch (err){
    console.log(err)
    res.send({status: -1})
  }
})

app.post('/api/users/addUsersToGroup', checkJwt, async (req, res) => {
  const {group_id, members} = req.body
  try{
    await members.forEach(async (member) => {
      var new_groupMembership = new GroupMembership({
        group_membership_id: uuid.v4(),
        user_id: member,
        group_id: group_id
      })

      await new_groupMembership.save()
    })
    res.send({status: 0})
  }
  catch (err) {
    console.log(err)
    res.send({status: -1})
  }
})

app.post('/api/users/deleteGroup', checkJwt, async (req, res) => {
  const {group_id} = req.body
  try{
    await GroupInfo.findOneAndDelete({group_id: group_id})
    await GroupMembership.deleteMany({group_id: group_id})
    await Message.deleteMany({room_id: group_id})
    res.send({status: 0})
  }
  catch (err){
    console.log(err)
    res.send({status: -1})
  }
})

app.post('/api/users/uploadImage', checkJwt, async (req, res) => {
  const {image} = req.body
  const user_id = req.user.id;
  try {
    await User.findOneAndUpdate({user_id: user_id}, {image: image})
  }
  catch (err){
    console.log(err)
    res.send({status: -1})
  }
  res.send({status: 0})
})

app.post('/api/messages/get', checkJwt, async (req, res) => {
  const {room, timestamp} = req.body
  var result;
  var allMessagesLoaded = false;
  if (!timestamp){
    result = await Message.find({room_id: room}, null, {skip: 0, limit: 20, sort: {timestamp: -1}})
  }
  else {
    result = await Message.find({room_id: room, timestamp: {$lt: parseInt(timestamp)}}, null, {skip: 0, limit: 20, sort: {timestamp: -1}})
  }
  if (result.length < 20){
    allMessagesLoaded = true
  }
  result.forEach((res) => {
    res.text = decryptMessage(res.text)
  })
  res.send({result: result, status: 0, allLoaded: allMessagesLoaded})
})

// Socket stuff

io.on("connection", socket => {
  socket.on('send-message', async (user_id, message, room) => {
    const isGroup = await GroupInfo.findOne({group_id: room})
    var verify;
    var users_to_notify;
    if (isGroup){
      verify = await GroupMembership.findOne({group_id: room, user_id: user_id})
      users_to_notify = await GroupMembership.find({group_id: room})
      users_to_notify = users_to_notify.filter((user) => user.user_id !== user_id).map((user) => user.user_id)
    }
    else{
      verify = await Friendship.findOne({friendships_id: room})
      users_to_notify = [verify].map((user) => {
        if (user.user1_id === user_id){
          return user.user2_id;
        }
        else{
          return user.user1_id;
        }
      })
    }
    
    if (verify){
      let id = uuid.v4();
  
      const encrypted_text = encryptMessage(message.text)
      
      const encrypted_message = new Message({
        message_id: id,
        room_id: room,
        sender_id: message.sender_id,
        text: encrypted_text,
        timestamp: Date.now().toString(),
        alert: message.alert
      })
      
      const new_message = {
        message_id: id,
        room_id: room,
        sender_id: message.sender_id,
        text: message.text,
        timestamp: Date.now().toString(),
        alert: message.alert
      }
      
      await encrypted_message.save().then(() => {
        io.in(room).emit("receive-message", new_message)
        
        users_to_notify.forEach(async (user) => {
            const already_notified = await Nofification.findOne({room_id: room, user_id: user})
            if (!already_notified){
              const notification = new Nofification({
                notification_id: uuid.v4(),
                user_id: user,
                room_id: room,
              })

              notification.save()
              io.in(user).emit('add_notification', room)
            }
          })
      })
    }
    else{
      console.log('No permissions to send message on this channel')
    }
  })

  socket.on("join-room", room => {
    socket.join(room)
  })

  socket.on("leave-room", room => {
    socket.leave(room)
  })

  socket.on("add-user-to-group", async (users_id) => {
    await users_id.forEach((user_id) => {
      io.in(user_id).emit("user-refresh-groups")
    })
  })

  socket.on("promote-user", async (user_id, group_id) => {
    try{
      socket.in(group_id).emit("user-refresh-groups")
    }
    catch{
      console.log('something went wrong with promoting the user')
    }
  })

  socket.on("kick-user", async (user_id, group_id) => {
    try{
      await GroupMembership.findOneAndDelete({group_id : group_id, user_id: user_id}).then(() => {
        io.in(user_id).emit("get-kicked", group_id)
      })
    }
    catch{
      console.log('something went wrong with kicking the user')
    }
  })

  socket.on("group-delete", async (members, group_id) => {
    members.forEach((member) => {
      socket.in(member).emit("group-delete-alert", group_id)
    })
  })

  socket.on("new-request", async (user_id) => {
    socket.in(user_id).emit("receive-new-request")
  })

  socket.on("clear-notifications", async (room, user_id) => {
    await Nofification.findOneAndDelete({room_id: room, user_id: user_id})
  })
})