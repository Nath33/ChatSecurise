module.exports = function (io, socket) {

    require('./adminsocket')

    const options = {
        transports: ['websocket'],
        'force new connection': true
    }
    
    let roomPassword = []

    return {

        verifPseudo: (pseudo) => {
            if (pseudo === 'Admin')
                adminSocket = socket
            if (pseudo == null)
                socket.emit('reloader', 'Pseudo non defini')
            else if (pseudo.length === 0 || !pseudo.replace(/\s/g, '').length)
                socket.emit("check", "Pseudo vide")
            else if (pseudo.length > 15)
                socket.emit('check', 'Pseudo trop long')
            else if (isPseudoFree(io.sockets.adapter.rooms, pseudo)) {
                socket.pseudo = pseudo
                socket.room = "Accueil"
                socket.join("Accueil")
                messageRoom(socket, 'connect')
                messageRoom(socket, 'join')
                sendListUserRoom(socket.room)
                sendYourRoom(socket)
                sendEveryOneListRoom()
            } else
                socket.emit("check", "Identifiant déjà utilisé")
        },
        disconnect: () => {
            messageRoom(socket, 'leave')
            messageRoom(socket, 'quit')
            sendListUserRoom(socket.room)
        },
        changePseudo: (data) => {
            const { newPseudo } = JSON.parse(data)
            if (newPseudo.length === 0 || !newPseudo.replace(/\s/g, '').length)
                socket.emit("alertServer", "Pseudo vide")
            else if (newPseudo.length > 15)
                socket.emit('alertServer', 'Pseudo trop long')
            else if (isPseudoFree(io.sockets.adapter.rooms, newPseudo)) {
                const oldPseudo = socket.pseudo
                socket.pseudo = newPseudo
                sendListUserRoom(socket.room)
                messageRoom(socket, 'changePseudo', oldPseudo)
                socket.emit('newPseudo', JSON.stringify({ newPseudo: newPseudo }))
            } else
                socket.emit("alertServer", "Identifiant déjà utilisé")
        },
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