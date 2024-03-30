const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const path = require('path');
const siteURL = process.env.SITEURL || 'http://localhost:3000' ;


const http = require('http').Server(app);
const cors = require('cors');
  app.use(cors());

let currUsers = [];

const socketIO = require('socket.io')(http, {
  cors: {
    origin: siteURL
  }
})

socketIO.on('connect', (socket) => {
  console.info(`${socket.id} | user connected.`)
  currUsers.push({id: socket.id, nickname: ''})
    console.error('userList:', currUsers)
  socketIO.emit('userList', currUsers)

  socket.on('disconnect', () => {
    currUsers = currUsers.filter((user) => socket.id !== user.id)
    console.info(`${socket.id} | user disconnected.`)
    console.error('userList:', currUsers)
    socketIO.emit('userList', currUsers)
  })

  socket.on('userUpdate', (data) => {
    console.log('nickname:', data.nickname)
    currUsers = currUsers.map((user) => user.id === data.id ? {...user, nickname: data.nickname}: user)
    socketIO.emit('userList', currUsers)
      console.error('userUpdate:', currUsers)
  })

  socket.on('messages', (data) => {
    socketIO.emit('msgResponse', data)
  })
})

app.get('/api', (req, res) => {
  res.json({
    message: 'API coming soon...',
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} 

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});