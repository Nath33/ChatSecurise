const app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    openSocket = require('socket.io-client')

const options = {
    transports: ['websocket'],
    'force new connection': true
}

let socket = openSocket('http://localhost:8081', options);
socket.emit("verif", "Admin")
let adminSocket
let roomPassword = []

io.sockets.on('connection', function (socket) {

    socket.on("verif", pseudo => {
        //dev
        if(pseudo.length === 0 )
            pseudo = 'test'
        //dev
        if (pseudo === 'Admin')
            adminSocket = socket
        if (pseudo.length === 0 || !pseudo.replace(/\s/g, '').length)
            socket.emit("check", "Pseudo vide")
        else if (pseudo.length > 15)
            socket.emit('check', 'Pseudo trop long')
        else if (isPseudoFree(io.sockets.adapter.rooms, pseudo)) {
            socket.pseudo = pseudo
            socket.room = "Accueil"
            socket.join("Accueil")
            messageRoom(socket, 'connect')
            messageRoom(socket,'join')
            sendListUserRoom(socket.room)
            sendYourRoom(socket)
            sendEveryOneListRoom()
        } else
            socket.emit("check", "Identifiant déjà utilisé")
    })

    socket.on('message', (message) => {
        console.log(message)//a garder pour montrer le cryptage (NICO DEPERO)
        io.to(socket.room).emit("message", JSON.stringify({ message: message, pseudo: socket.pseudo }));
    })

    socket.on('disconnect', () => {
        messageRoom(socket,'leave')
        messageRoom(socket,'quit')
        sendListUserRoom(socket.room)
    })

    socket.on('changeRoom', (data) => {
        const { newRoom } = JSON.parse(data)
        if(newRoom === socket.room)
            return
        //verif password
        if(roomPassword[newRoom])
            socket.emit('passwordAsk',newRoom)
        else {
            if(socket.room !== 'Accueil' && listUserRoom(socket.room).length === 1){
                if(roomPassword[newRoom])
                    roomPassword.splice(roomPassword.indexOf(roomPassword[newRoom]),1)
                messageRoom(socket, 'delete')
            }
            leaveRoom(socket)
            joinRoom(newRoom)
            if(listUserRoom(socket.room).length === 1)
                messageRoom(socket,'create')
            sendYourRoom(socket)
            sendEveryOneListRoom()
        }
    })

    socket.on('setPasswordRoom',(data) => {
        const { newRoom, password } = JSON.parse(data)
        roomPassword[newRoom] = password
        if(newRoom === socket.room)
            return
        if(socket.room !== 'Accueil' && listUserRoom(socket.room).length === 1){
            if(roomPassword[newRoom])
                roomPassword.splice(roomPassword.indexOf(roomPassword[newRoom]),1)
            messageRoom(socket, 'delete')
        }
        leaveRoom(socket)
        joinRoom(newRoom)
        if(listUserRoom(socket.room).length === 1)
            messageRoom(socket,'create')
        sendYourRoom(socket)
        sendEveryOneListRoom()
    })

    socket.on('changeRoomPassword', (data) => {
        let { newRoom } = JSON.parse(data)
        newRoom = newRoom+' - lock'
        socket.emit('setPassword', newRoom)
    })

    socket.on('checkPassword',(data) => {
        const { password, newRoom } = JSON.parse(data)
        if(password === roomPassword[newRoom]){
            if(socket.room !== 'Accueil' && listUserRoom(socket.room).length === 1){
                if(roomPassword[newRoom])
                    roomPassword.splice(roomPassword.indexOf(roomPassword[newRoom]),1)
                messageRoom(socket, 'delete')
            }
            leaveRoom(socket)
            joinRoom(newRoom)
            if(listUserRoom(socket.room).length === 1)
                messageRoom(socket,'create')
            sendYourRoom(socket)
            sendEveryOneListRoom()
        }else
            socket.emit('alertServer','Mot de passe invalide')
    })

    socket.on('changePseudo',(data) => {
        const { newPseudo } = JSON.parse(data)
        console.log(newPseudo)
        if(newPseudo.length === 0 || !newPseudo.replace(/\s/g, '').length)
            socket.emit("alertServer", "Pseudo vide")
        else if(newPseudo.length > 15)
            socket.emit('alertServer', 'Pseudo trop long')
        else if (isPseudoFree(io.sockets.adapter.rooms, newPseudo)) {
            const oldPseudo = socket.pseudo
            socket.pseudo = newPseudo
            sendListUserRoom(socket.room)
            sendYourRoom(socket)
            sendEveryOneListRoom()
            messageRoom(socket, 'changePseudo', oldPseudo)
            socket.emit('newPseudo',JSON.stringify({newPseudo: newPseudo}))
        } else
            socket.emit("alertServer", "Identifiant déjà utilisé")
    })

    /*------------------------------*/

    function leaveRoom(socket) {
        let roomName = socket.room;
        messageRoom(socket,'leave')
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
        messageRoom(socket,'join')
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
                messageRoom = socket.pseudo + ' a rejoint la room '+socket.room
                io.to(socket.room).emit("messageServ", JSON.stringify({ message: messageRoom, pseudo: adminSocket.pseudo }))
                break;
            case 'leave':
                messageRoom = socket.pseudo + ' a quitter la room '+socket.room
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
                messageRoom = socket.pseudo+' a creer la room : ' + socket.room
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

server.listen(8081, () => {
    console.log("listen on 8081")
})
