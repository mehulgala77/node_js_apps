// Make Socket Connection
const socket = io.connect('http://localhost:4000');

// Query DOM
const message = document.getElementById('message');
const handle = document.getElementById('handle');
const sendBtn = document.getElementById('send');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');

sendBtn.addEventListener('click', () => {
  // Emit a chat message to the server.
  socket.emit('chat', {
    message: message.value,
    handle: handle.value,
  });
});

message.addEventListener('keypress', () => {
  // Emit a Typing message to the server.
  socket.emit('typing', handle.value);
});

// Listen for 'chat' messages coming from the server.
socket.on('chat', (data) => {
  output.innerHTML
    += `<p><strong>${data.handle}: </strong>${data.message}</p>`;
  feedback.innerHTML = '';
  message.value = '';
});

// Listen for 'typing' messages coming from the server.
socket.on('typing', (data) => {
  feedback.innerHTML
    = `<p><em>${data} is typing a message...</em></p>`
});
