module.exports = function (io, socket) {
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
}