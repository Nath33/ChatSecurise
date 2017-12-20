module.exports = function (io, socket) {

    require('./adminsocket')

    const options = {
        transports: ['websocket'],
        'force new connection': true
    }
    
    let roomPassword = []

    return {
        message: (message) => {
            console.log(message)//a garder pour montrer le cryptage (NICO DEPERO)
            io.to(socket.room).emit("message", JSON.stringify({ message: message, pseudo: socket.pseudo }));
        }
    }

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
}