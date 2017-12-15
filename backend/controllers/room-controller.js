module.exports = function (io, socket) {
    return {
        changeRoom: (data) => {
            const { newRoom } = JSON.parse(data)
            if (newRoom === socket.room)
                return
            //verif password
            if (roomPassword[newRoom])
                socket.emit('passwordAsk', newRoom)
            else {
                if (socket.room !== 'Accueil' && listUserRoom(socket.room).length === 1) {
                    if (roomPassword[newRoom])
                        roomPassword.splice(roomPassword.indexOf(roomPassword[newRoom]), 1)
                    messageRoom(socket, 'delete')
                }
                leaveRoom(socket)
                joinRoom(newRoom)
                if (listUserRoom(socket.room).length === 1)
                    messageRoom(socket, 'create')
                sendYourRoom(socket)
                sendEveryOneListRoom()
            }
        },
        setPasswordRoom: (data) => {
            const { newRoom, password } = JSON.parse(data)
            roomPassword[newRoom] = password
            if (newRoom === socket.room)
                return
            if (socket.room !== 'Accueil' && listUserRoom(socket.room).length === 1) {
                if (roomPassword[newRoom])
                    roomPassword.splice(roomPassword.indexOf(roomPassword[newRoom]), 1)
                messageRoom(socket, 'delete')
            }
            leaveRoom(socket)
            joinRoom(newRoom)
            if (listUserRoom(socket.room).length === 1)
                messageRoom(socket, 'create')
            sendYourRoom(socket)
            sendEveryOneListRoom()
        },
        changeRoomPassword: (data) => {
            let { newRoom } = JSON.parse(data)
            newRoom = newRoom + ' - lock'
            socket.emit('setPassword', newRoom)
        },
        checkPassword: (data) => {
            const { password, newRoom } = JSON.parse(data)
            if (password === roomPassword[newRoom]) {
                if (socket.room !== 'Accueil' && listUserRoom(socket.room).length === 1) {
                    if (roomPassword[newRoom])
                        roomPassword.splice(roomPassword.indexOf(roomPassword[newRoom]), 1)
                    messageRoom(socket, 'delete')
                }
                leaveRoom(socket)
                joinRoom(newRoom)
                if (listUserRoom(socket.room).length === 1)
                    messageRoom(socket, 'create')
                sendYourRoom(socket)
                sendEveryOneListRoom()
            } else
                socket.emit('alertServer', 'Mot de passe invalide')
        },
    }
}