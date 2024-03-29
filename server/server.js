const express = require("express");
const app = express();
const PORT = 4000;
const path = require('path');

const http = require('http').Server(app);
const cors = require('cors');
  app.use(cors());

let currUsers = [];

const socketIO = require('socket.io')(http, {
  cors: {
    origin: "https://react-chat-r4y1.onrender.com"
  }
})

socketIO.on('connect', (socket) => {
  console.log(`${socket.id} user just connected.`)
  currUsers.push({id: socket.id})
  socketIO.emit('userList', currUsers)

  socket.on('disconnect', () => {
    console.log(`${socket.id} - User disconnected.`)
    
    currUsers = currUsers.filter((user) => socket.id !== user.id)
    socketIO.emit('userList', currUsers)
  })

  socket.on('messages', (data) => {
    socketIO.emit('msgResponse', data)
  })
})

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} 

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});