const {getUsers, users} = require('./getUsers');

//for establishing socket connection
function socket(io) {
    io.on('connection', (socket) => {
        console.log('connected user!');
        socket.on('joined-user', (data) => {

            //to store users connected to the room in memory
            let user = {};
            user[socket.id] = data.username;
            if (users[data.roomname]) {
                users[data.roomname].push(user);
            }
            else users[data.roomname] = [user];

            //for joining the room
            socket.join(data.roomname);

            //for emitting new username to clients
            io.to(data.roomname).emit('joined-user', {username: data.username});

            //for sending online users array
            io.to(data.roomname).emit('online-users', getUsers(users[data.roomname]));
        });

        //to emit messages to clients
        socket.on('chat', (data) => {
            io.to(data.roomname).emit('chat', {username: data.username, message: data.message});
        });

        //to broadcast who typing
        socket.on('typing', (data) => {
            socket.broadcast.to(data.roomname).emit('typing', data.username);
        });

        //to remove users from memory when they disconnect
        socket.on('disconnecting', () => {
            let rooms = Object.keys(socket.rooms);
            let socketId = rooms[0];
            let roomname = rooms[1];
            users[roomname].forEach((user, index) => {
                if(user[socketId]) users[roomname].splice(index, 1);
            });

            //for sending users array online
            io.to(roomname).emit('online-users', getUsers(users[roomname]));
        });
    });
}

module.exports = socket;