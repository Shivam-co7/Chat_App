//for getting html elements with DOM
const output   = document.getElementById('output');
const message  = document.getElementById('message');
const feedback = document.getElementById('feedback');
const roomMsg  = document.querySelector('.room-message');
const users    = document.querySelector('.users');

//url for socket server
const url    = "http://localhost:8080";
const socket = io.connect(url);

//for fetching params from url
const queryString = window.location.search;
const urlParams   = new URLSearchParams(queryString);
const username    = urlParams.get('username');
const roomname    = urlParams.get('roomname');
console.log(username, roomname);

//for displaying the current roomname on which the user is connected
roomMsg.innerHTML = `Inside the Room ${roomname}`;

//for shouting user & room name of newly joined user by emmiting socket events
socket.emit('joined-user', {
    username: username,
    roomname: roomname
});

//for sending data when user clicks send by emitting socket events
function send(){
    console.log("checking: " + message.value);
    socket.emit('chat', {
                username: username,
                message: message.value,
                roomname: roomname
            });
            message.value = '';
}

//for sending username if it's typing by emitting socket events
message.addEventListener('keypress', () => {
    socket.emit('typing', {username: username, roomname: roomname});
});

//to display if new user has joined the room by receiving socket emitted events
socket.on('joined-user', (data) => {
    output.innerHTML += '<p> --> <strong><em>' + data.username + '</strong> has Joined the Room!</em></p>';
});

//to display the message sent from user by receiving socket emitted events
socket.on('chat', (data) => {
output.innerHTML += '<p> --> <strong>' + data.username + '</strong>: ' + data.message + '</p>';
feedback.innerHTML = '';
document.querySelector('.chat-message').scrollTop = document.querySelector('.chat-message').scrollHeight;
});

//to display if user is typing
socket.on('typing', (user) => {
    feedback.innerHTML = '<p><em>' + user + ' is typing...</em></p>';
});

//for displaying the currently online users
socket.on('online-users', (data) => {
    users.innerHTML = '';
    data.forEach(user => {
        users.innerHTML += `<p>${user}</p>`;
    });
});         