module.export = function (server) {
    const io = require('socket.io').listen(server)

    const messageController = require('./controllers/message-controller')
    const roomController = require('./controllers/room-controller')
    const pseudoController = require('./controllers/pseudo-controller')

    io.sockets.on('connection', function (socket) {

        const messageHandler = messageController(io, socket)
        const roomHandler = roomController(io, socket)
        const pseudoHandler = pseudoController(io, socket)

        socket.on('verifPseudo', pseudoHandler.verifPseudo)
        socket.on('changePseudo', pseudoHandler.changePseudo)
        socket.on('disconnect', pseudoHandler.disconnect)

        socket.on('message', messageHandler.message)

        socket.on('changeRoom', roomHandler.changeRoom)
        socket.on('setPasswordRoom', roomHandler.setPasswordRoom)
        socket.on('changeRoomPassword', roomHandler.changeRoomPassword)
        socket.on('checkPassword', roomHandler.checkPassword)

        function leaveRoom(socket) {
            let roomName = socket.room;
            messageRoom(socket, 'leave')
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
            messageRoom(socket, 'join')
            sendListUserRoom(socket.room);
        }

        function listUserRoom(room) {
            let listUser = []
            for (const sock in io.in(room).connected) {
                if (
                    io.in(room).connected.hasOwnProperty(sock) &&
                    io.in(room).connected[sock].room === room
                )
                    listUser.push(io.in(room).connected[sock].pseudo)
            }
            return listUser
        }

        function sendYourRoom(socket) {
            socket.emit("yourRoom", JSON.stringify(socket.room));
        }

        function getConnectedSocketIdsList() {
            let ids = []
            for (const id in io.sockets.connected) {
                if (io.sockets.adapter.rooms.hasOwnProperty(id))
                    ids.push(id)
            }
            return ids
        }

        function sendEveryOneListRoom() {
            let listRooms = []
            let connectedSocketIds = getConnectedSocketIdsList()
            for (const room in io.sockets.adapter.rooms) {
                if (
                    io.sockets.adapter.rooms.hasOwnProperty(room) &&
                    connectedSocketIds.indexOf(room) === -1
                )
                    listRooms.push(room)
            }
            io.sockets.emit('listRoom', JSON.stringify(listRooms))
        }

        function isPseudoFree(rooms, pseudo) {
            for (const sock in io.in(rooms).connected) {
                if (
                    io.in(rooms).connected.hasOwnProperty(sock) &&
                    io.in(rooms).connected[sock].pseudo === pseudo
                )
                    return false
            }
            return true
        }

        function messageRoom(socket, action, alt) {
            let roomAccueil = adminSocket.room
            let messageRoom
            switch (action) {
                case 'join':
                    messageRoom = socket.pseudo + ' a rejoint la room ' + socket.room
                    io.to(socket.room).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
                    break;
                case 'leave':
                    messageRoom = socket.pseudo + ' a quitter la room ' + socket.room
                    io.to(socket.room).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
                    break;
                case 'connect':
                    messageRoom = socket.pseudo + ' a rejoint le chat '
                    io.to(socket.room).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
                    break;
                case 'quit':
                    messageRoom = socket.pseudo + ' a quitter le chat '
                    io.to(socket.room).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
                    break;
                case 'create':
                    messageRoom = socket.pseudo + ' a creer la room : ' + socket.room
                    io.to(roomAccueil).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
                    break;
                case 'delete':
                    messageRoom = socket.pseudo + ' a  supprimer la room : ' + socket.room
                    io.to(roomAccueil).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
                    break;
                case 'changePseudo':
                    messageRoom = alt + " maintenant s'appel " + socket.pseudo
                    io.to(socket.room).emit('messageServ', JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
                    break;
                default:
                    console.log('erreur : action inconnu')
            }
        }

    })
}