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
  currUsers.push({id: socket.id})
  socketIO.emit('userList', currUsers)

  socket.on('disconnect', () => {
    const newUsers = currUsers.filter((user) => socket.id !== user.id)
    socketIO.emit('userList', newUsers)
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