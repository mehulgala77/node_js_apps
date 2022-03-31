const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { joinUser, getCurrentUser, removeUser, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'CharCord Bot'

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => { 

  socket.on('joinRoom', ({ username, room }) => {

    const user = joinUser(socket.id, username, room);

    // Socket provides join functionality.
    socket.join(user.room);

    // This will send the message to the current client connection.
    socket.emit(
      'message', 
      formatMessage(botName, `Welcome ${username} to ChatCord`)
    );

    // This will broadcast the messsage to all the clients except the current client.
    socket.broadcast.to(user.room).emit(
      'message', 
      formatMessage(botName, `${username} has joined the chat`)
    );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chat message
  socket.on('chatMessage', (message) => {

    // Get the current user
    const user = getCurrentUser(socket.id);

    // Broadvast this to all users of this room
    io.to(user.room).emit('message', formatMessage(user.username, message));
  });

  // Runs when a client disconnects.
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {      
      io.to(user.room).emit(
        'message', 
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      socket.broadcast.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  
  });
});

const PORT = 4001 || process.env.port;

server.listen(PORT, () => `Server running on port: ${PORT}`);