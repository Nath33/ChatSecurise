const app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    openSocket = require('socket.io-client')
const options = {
    transports: ['websocket'],
    'force new connection': true
};

let socket = openSocket('http://localhost:8081', options);
socket.emit("verif", "Admin")
let adminSocket

io.sockets.on('connection', function (socket) {

    socket.on("verif", pseudo => {
        if(pseudo==='Admin'){
            adminSocket=socket
        }
        if(pseudo.length === 0 || !pseudo.replace(/\s/g, '').length){
            socket.emit("check", "Pseudo vide");
        }else if (isPseudoFree(io.sockets.adapter.rooms, pseudo)) {
            socket.pseudo = pseudo
            socket.room = "Accueil"
            socket.join("Accueil")
            messageQuitChat(socket, 'connect')
            messageMoveRoom(socket,'join')
            sendListUserRoom(socket.room)
            sendYourRoom(socket)
            sendEveryOneListRoom()
        } else {
            socket.emit("check", "Identifiant déjà utilisé");
        }
    })

    socket.on('message', (message) => {
        console.log(message);
        io.to(socket.room).emit("message", JSON.stringify({ message: message, pseudo: socket.pseudo }));
    })

    socket.on('disconnect', () => {
        messageMoveRoom(socket,'leave')
        messageQuitChat(socket,'quit')
        sendListUserRoom(socket.room)
    })

    socket.on('changeRoom', (data) => {
        const {newRoom} = JSON.parse(data)
        if(newRoom === socket.room){return}
        if(socket.room !== 'Accueil' && listUserRoom(socket.room).length === 1){
            messageRoomDeleteOrCreate(socket.room, 'delete')
        }
        leaveRoom(socket)
        joinRoom(newRoom)
        if(listUserRoom(socket.room).length===1){
            messageRoomDeleteOrCreate(socket.room,'create')
        }
        sendYourRoom(socket)
        sendEveryOneListRoom()
    })

    /*------------------------------*/

    function leaveRoom(socket) {
        let roomName = socket.room;
        messageMoveRoom(socket,'leave')
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
        messageMoveRoom(socket,'join')
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

    function messageQuitChat(socket, action){
        if (action === 'connect') {
            let messageRoom = socket.pseudo + ' a rejoint le chat '
            io.to(socket.room).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
        }else if(action === 'quit'){
            let messageRoom = socket.pseudo + ' a quitter le chat '
            io.to(socket.room).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
        }
    }

    function messageMoveRoom(socket, action) {
        if (action === 'join') {
            let messageRoom = socket.pseudo + ' a rejoint la room '+socket.room
            io.to(socket.room).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
        }else if(action === 'leave'){
            let messageRoom = socket.pseudo + ' a quitter la room '+socket.room
            io.to(socket.room).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
        }
    }

    function messageRoomDeleteOrCreate(room, action) {
        let roomAccueil=adminSocket.room
        console.log('accueil ',roomAccueil)
        if (action === 'create') {
                let messageRoom = socket.pseudo+' a creer la room : ' + room
                io.to(roomAccueil).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
        }else if(action === 'delete'){
                let messageRoom =socket.pseudo + ' a  supprimer la room : ' + room
                io.to(roomAccueil).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
        }
    }
})


server.listen(8081, () => {
    console.log("listen on 8081")
})
