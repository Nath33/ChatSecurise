var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)
var Client = require('./src/Client')

let rooms = {default: [],}

console.log("Starting socket")
io.sockets.on('connection', function (socket) {

    function sendListUser() {
        let listUser = []
        rooms.default.forEach(function (item) {
            listUser.push(item.getPseudo());
        });
        let value = JSON.stringify(listUser);;
        socket.emit("List", value);
        socket.broadcast.emit("List", value);
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
        console.log("sending to ", rooms.default.length, message)
        let pseudo = rooms.default[rooms.default.findIndex(elt => elt.socket === socket)].pseudo
        for (let index in rooms.default) {
            rooms.default[index].socket.emit("message", JSON.stringify({message: message, pseudo: pseudo}))
        }
    })

    socket.on('privateMessage', (data) => {
        data = JSON.parse(data)
        console.log(data)
        let pseudo = rooms.default[rooms.default.findIndex(elt => elt.socket === socket)].pseudo
        for (let index in rooms.default) {
            console.log(rooms.default[index].pseudo, data.pseudo)
            if (data.pseudo.indexOf(rooms.default[index].pseudo) !== -1) {
                rooms.default[index].socket.emit("message", JSON.stringify({message: data.message, pseudo: pseudo}))
            }
        }
    })

    socket.on('createRoom', (data) => {
        const {oldRoom, newRoom} = JSON.parse(data)
        let user = getUserAndRemoveItFromRoomBySocket(oldRoom);
        rooms[newRoom] = []
        rooms[newRoom].push(user)

        sendListRoom(true)
    })

    socket.on('changeRoom', (data) => {
        const {oldRoom, newRoom} = JSON.parse(data)
        let user = getUserAndRemoveItFromRoomBySocket(oldRoom);
        rooms[newRoom].push(user)
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