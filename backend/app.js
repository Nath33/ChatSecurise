var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)

let clients = []

io.sockets.on('connection', function (socket) {

    socket.on("verif", pseudo => {
        if (clients.findIndex(elt => elt.pseudo) === -1) {
            clients.push({pseudo: pseudo, socket: socket})
        } else {
            socket.emit("Error", "Identifiant déjà utilisé")
        }
    })

    socket.on('disconect', () => {clients.splice(clients.findIndex(elt => elt.socket === socket), 1)})
});

server.listen(8081);
