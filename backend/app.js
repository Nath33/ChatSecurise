const app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)

console.log("Starting socket")
io.sockets.on('connection', function (socket) {
    socket.on("verif", pseudo => {
        if (isPseudoFree(io.sockets.adapter.rooms, pseudo)) {
            socket.pseudo = pseudo
            socket.room = "default"
            socket.join("default")
            sendListUserRoom(socket.room)
            sendYourRoom(socket)
            sendEveryOneListRoom()
        } else {
            socket.emit("check", "Identifiant déjà utilisé");
        }
    })

    socket.on('message', (message) => {
        console.log(message);
        io.to(socket.room).emit("message", JSON.stringify({message: message, pseudo: socket.pseudo}));
    })

    socket.on('changeRoom', (data) => {
        const {newRoom} = JSON.parse(data)
        if(newRoom === socket.room){return}
        leaveRoom(socket)
        joinRoom(newRoom)
        sendYourRoom(socket)
        sendEveryOneListRoom()
    })

    /*------------------------------*/

    function leaveRoom(socket) {
        let roomName = socket.room;
        socket.leave(roomName)
        socket.room = undefined
        sendListUserRoom(roomName)
    }

    function sendListUserRoom(room) {
        io.to(room).emit("List", JSON.stringify(listUserRoom(room)));
    }

    function joinRoom(roomName) {
        socket.room = roomName
        socket.join(socket.room)
        sendListUserRoom(socket.room);
    }

    function listUserRoom(room) {
        let listUser = []
        for (const sock in io.in(room).connected) {
            if (
                io.in(room).connected.hasOwnProperty(sock) &&
                io.in(room).connected[sock].room === room
            ) {
                listUser.push(io.in(room).connected[sock].pseudo)
            }
        }
        return listUser
    }

    function sendYourRoom(socket) {
        socket.emit("yourRoom", JSON.stringify(socket.room));
    }

    function getConnectedSocketIdsList() {
        let ids = []
        for (const id in io.sockets.connected) {
            if (io.sockets.adapter.rooms.hasOwnProperty(id)) {
                ids.push(id)
            }
        }
        return ids
    }

    function sendEveryOneListRoom() {
        let listRooms = []
        let connectedSocketIds = getConnectedSocketIdsList()
        for (const room in io.sockets.adapter.rooms) {
            if (io.sockets.adapter.rooms.hasOwnProperty(room) && connectedSocketIds.indexOf(room) === -1) {
                listRooms.push(room)
            }
        }

        io.sockets.emit('listRoom', JSON.stringify(listRooms))
    }

    function isPseudoFree(rooms, pseudo) {
        for (const sock in io.in(rooms).connected) {
            if (
                io.in(rooms).connected.hasOwnProperty(sock) &&
                io.in(rooms).connected[sock].pseudo === pseudo
            ) {
                return false
            }
        }

        return true
    }
})


server.listen(8081, () => {
    console.log("listen on 8081")
})