module.exports = function (serveur) {
    const io = require('socket.io').listen(serveur)

    const messageController = require('./controllers/message-controller')
    const roomController = require('./controllers/room-controller')
    const pseudoController = require('./controllers/pseudo-controller')

    io.sockets.on('connection', function (socket) {

        const messageHandler = messageController(io, socket)
        const roomHandler = roomController(io, socket)
        const pseudoHandler = pseudoController(io, socket)

        socket.on('verif', pseudoHandler.verifPseudo)
        socket.on('changePseudo', pseudoHandler.changePseudo)
        socket.on('disconnect', pseudoHandler.disconnect)

        socket.on('message', messageHandler.message)

        socket.on('changeRoom', roomHandler.changeRoom)
        socket.on('setPassword', roomHandler.setPasswordRoom)
        socket.on('changeRoomPassword', roomHandler.changeRoomPassword)
        socket.on('checkPassword', roomHandler.checkPassword)

    })
}