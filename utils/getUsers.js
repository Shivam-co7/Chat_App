//for storing connected users
let users = {};

//method to get users online in the room
function getUsers(arr){
    const onlineUsers = [];
    arr.forEach((user) => {
        onlineUsers.push(Object.values(user)[0]);
    });
    return onlineUsers;
}

module.exports = {getUsers, users};