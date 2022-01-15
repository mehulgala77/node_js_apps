const express = require('express');
const socketio = require('socket.io');

const app = express();

app.use(express.static('public'));

const server = app.listen(4000, () => {
  console.log('Server running on 4000');
})

// Initialize Socket IO library
const io = socketio(server);

// Listen for connection from client.
io.on('connection', (socket) => {
  console.log('Made socket connection', socket.id);

  // Listen for chat messages sent by any client.
  socket.on('chat', (data) => {
    // Broadcase this message to all clients
    io.sockets.emit('chat', data);
  });

  // Listen for typing messages sent by any client.
  socket.on('typing', (data) => {
    // Broadcase this message to all clients except the sender
    socket.broadcast.emit('typing', data);
  });
})