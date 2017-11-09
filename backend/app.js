var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)
var Client = require('./src/Client')

let rooms = {default: [],}

console.log("Starting socket")
io.sockets.on('connection', function (socket) {

    function sendToRoom(room, key, value) {
        room.map(client => client.getSocket().emit(key, value))
    }

    function listUserRoom(room) {
        let listUser = []
        room.forEach(function (item) {
            listUser.push(item.getPseudo());
        });
        return listUser;
    }

    function sendListUser() {
        let listUser = listUserRoom(findUserInRoom(socket).room);
        let value = JSON.stringify(listUser)
        socket.emit("List", value);
        sendToRoom(findUserInRoom(socket).room, "List", value)
        sendYourRoom()
    }

    function sendYourRoom() {
        let roomName = findRoomName(findUserInRoom(socket).room);
        socket.emit("yourRoom", JSON.stringify(roomName));
    }


    socket.on("verif", pseudo => {
        if (rooms.default.findIndex(elt => elt.pseudo === pseudo) === -1) {
            rooms.default.push(new Client(pseudo, socket));
            sendListUser()
            sendListRoom()
        } else {
            socket.emit("check", "Identifiant déjà utilisé");
        }
    })

    socket.on('disconect', () => {
        let obj = findUserInRoom(socket);
        if(obj === null){return}
        removeUserFromItsRoom(findRoomName(obj.room), obj.index)
        sendListUser()
    })

    socket.on('message', (message) => {
        let room = findUserInRoom(socket).room;
        console.log("sending to ", room.length, message)
        let pseudo = room[room.findIndex(elt => elt.socket === socket)].pseudo
        sendToRoom(room, 'message', JSON.stringify({message: message, pseudo: pseudo}))
    })

    socket.on('createRoom', (data) => {
        const {newRoom} = JSON.parse(data)
        let oldRoom = findUserInRoom(socket).room
        let user = getUserAndRemoveItFromRoomBySocket(findRoomName(oldRoom));
        rooms[newRoom] = []
        rooms[newRoom].push(user)
        sendToRoom(oldRoom, "List", listUserRoom(oldRoom))
        sendListRoom(true)
        sendListUser()
    })

    socket.on('changeRoom', (data) => {
        const {newRoom} = JSON.parse(data)
        let oldRoom = findUserInRoom(socket).room;
        let user = getUserAndRemoveItFromRoomBySocket(findRoomName(oldRoom));
        rooms[newRoom].push(user)
        sendToRoom(oldRoom, 'List', listUserRoom(oldRoom))
        sendListUser()
        sendListRoom()
    })

    function sendListRoom(all) {
        if (all) {
            socket.broadcast.emit("listRoom", JSON.stringify(Object.keys(rooms)))
            socket.emit("listRoom", JSON.stringify(Object.keys(rooms)))
        }
        else {
            socket.emit("listRoom", JSON.stringify(Object.keys(rooms)))
        }
    }

    socket.on('inviteRoom', (data) => {
        const {oldRoom, newRoom, pseudo} = JSON.parse(data)
        let user = getUserAndRemoveItFromRoomByPseudo(oldRoom, pseudo)
        rooms[newRoom].push(user)
    })

    function findRoomName(room){
        for(let room2 in rooms){
            if(room === rooms[room2]){
                return room2
            }
        }
    }

    function checkIfShouldBeDeleted(oldRoom) {
        if (rooms[oldRoom].length === 0 && oldRoom !== "default") {
            delete rooms[oldRoom]
        }
    }

    function removeUserFromItsRoom(oldRoom, userIndex) {
        let user = rooms[oldRoom][userIndex]
        rooms[oldRoom].splice(userIndex, 1)
        checkIfShouldBeDeleted(oldRoom)
        return user;
    }

    function getUserAndRemoveItFromRoomBySocket(oldRoom) {
        let userIndex = rooms[oldRoom].findIndex(elt => elt.getSocket() === socket);
        return removeUserFromItsRoom(oldRoom, userIndex);
    }

    function getUserAndRemoveItFromRoomByPseudo(oldRoom, pseudo) {
        let userIndex = rooms[oldRoom].findIndex(elt => elt.getPseudo() === pseudo);
        return removeUserFromItsRoom(oldRoom, userIndex)
    }

    function findUserInRoom(socket) {
        for (let room in rooms) {
            let index = rooms[room].findIndex(elt => elt.getSocket() === socket);
            if (index !== null && index !== -1) {
                return {room: rooms[room], index: index}
            }
        }
        return null
    }
});

server.listen(8081, () => {
    console.log("listen on 8081")
})

module.exports = {rooms}