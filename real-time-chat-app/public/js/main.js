const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessagesContainer = document.querySelector('.chat-messages');

// Get username and room from Query Params
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  console.log(room, users);
  outputRoom(room);
  outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
  outputMessage(message);

  // Scroll down the chat Message section
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message from the DOM
  const msg = e.target.elements.msg.value;

  // Emit message to the server.
  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

// Output message to the DOM
function outputMessage(message) {
  const newMessageElement = document.createElement('div');
  newMessageElement.classList.add('message');
  newMessageElement.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;

  chatMessagesContainer.appendChild(newMessageElement);
}

function outputRoom(room) {
  const roomNameNode = document.getElementById('room-name');
  roomNameNode.innerText = room;
}

function outputUsers(users) {
  const usersNode = document.getElementById('users');
  usersNode.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}