var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)
var Client = require('./src/Client')

console.log("Starting socket")
let rooms = {default: [],}
io.sockets.on('connection', function (socket) {

    socket.on("verif", pseudo => {
        if (isPseudoFree(rooms, pseudo)) {
            rooms.default.push(new Client(pseudo, socket));
            sendToRoom(rooms.default, "List", JSON.stringify(listUserRoom(rooms.default)))
            sendYourRoom(socket, rooms)
            sendEveryOneListRoom(socket, rooms)
        } else {
            socket.emit("check", "Identifiant déjà utilisé");
        }
    })

    socket.on('disconect', () => {
        let room = findRoomAndUserIndex(socket, rooms);
        if (room === null) {
            return
        }
        let roomToSpeak = findRoomAndUserIndex(socket, rooms).room
        removeUserFromItsRoom(findRoomName(room.room, rooms), room.index)
        sendToRoom(roomToSpeak, "List", JSON.stringify(listUserRoom(roomToSpeak)))
    })

    socket.on('message', (message) => {
        let room = findRoomAndUserIndex(socket, rooms).room;
        console.log("sending to ", room.length, message)
        let pseudo = room[room.findIndex(elt => elt.socket === socket)].pseudo
        sendToRoom(room, 'message', JSON.stringify({message: message, pseudo: pseudo}))
    })

    socket.on('createRoom', (data) => {
        const {newRoom} = JSON.parse(data)
        let oldRoom = findRoomAndUserIndex(socket, rooms).room
        let user = getUserAndRemoveItFromRoomBySocket(findRoomName(oldRoom, rooms));
        rooms[newRoom] = []
        rooms[newRoom].push(user)
        oldRoom = rooms[findRoomName(oldRoom, rooms)]
        sendToRoom(oldRoom, "List", JSON.stringify(listUserRoom(oldRoom)))
        sendEveryOneListRoom(socket, rooms)

        let room = findRoomAndUserIndex(socket, rooms).room
        sendToRoom(room, "List", JSON.stringify(listUserRoom(room)))
        sendYourRoom(socket, rooms)
    })

    socket.on('changeRoom', (data) => {
        const {newRoom} = JSON.parse(data)
        let oldRoom = findRoomAndUserIndex(socket, rooms).room;
        let user = getUserAndRemoveItFromRoomBySocket(findRoomName(oldRoom, rooms));
        rooms[newRoom].push(user)

        oldRoom = rooms[findRoomName(oldRoom, rooms)]
        if(oldRoom){
            sendToRoom(oldRoom, 'List', JSON.stringify(listUserRoom(oldRoom)))
        }

        let room = findRoomAndUserIndex(socket, rooms).room
        sendToRoom(room, "List", JSON.stringify(listUserRoom(room)))

        sendYourRoom(socket, rooms)
        sendEveryOneListRoom(socket, rooms) //  A room can be deleted
    })

    socket.on('inviteRoom', (data) => {
        const {oldRoom, newRoom, pseudo} = JSON.parse(data)
        let user = getUserAndRemoveItFromRoomByPseudo(oldRoom, pseudo)
        rooms[newRoom].push(user)
    })


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
    /*------------------------------*/
    function findRoomAndUserIndex(socket, rooms) {
        for (let room in rooms) {
            let index = rooms[room].findIndex(elt => elt.getSocket() === socket);
            if (index !== null && index !== -1) {
                return {room: rooms[room], index: index}
            }
        }
        return null
    }

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

    function sendYourRoom(socket, rooms) {
        let roomName = findRoomName(findRoomAndUserIndex(socket, rooms).room, rooms);
        socket.emit("yourRoom", JSON.stringify(roomName));
    }

    function findRoomName(room, rooms) {
        for (let tmpRoom in rooms) {
            if (room === rooms[tmpRoom]) {
                return tmpRoom
            }
        }
    }

    function sendEveryOneListRoom(socket, rooms) {
        socket.broadcast.emit("listRoom", JSON.stringify(Object.keys(rooms)))
        socket.emit("listRoom", JSON.stringify(Object.keys(rooms)))
    }

    function isPseudoFree(rooms, pseudo) {
        return rooms.default.findIndex(elt => elt.pseudo === pseudo) === -1;
    }

});



server.listen(8081, () => {
    console.log("listen on 8081")
})

module.exports = {rooms}