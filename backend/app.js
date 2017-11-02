var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)

let clients = []
console.log("Starting socket")
io.sockets.on('connection', function (socket) {

    socket.on("verif", pseudo => {
        if (clients.findIndex(elt => elt.pseudo === pseudo) === -1) {
            clients.push({pseudo: pseudo, socket: socket})
        } else {
            socket.emit("Error", "Identifiant déjà utilisé")
        }
    })

    socket.on('disconect', () => {
        clients.splice(clients.findIndex(elt => elt.socket === socket), 1)
    })

    socket.on('message', (message) => {
        let pseudo = clients[clients.findIndex(elt => elt.socket === socket)].pseudo
        for (let index in clients) {
            clients[index].socket.emit("message", JSON.stringify({message: message, pseudo: pseudo}))
        }
    })
});

server.listen(8081, () => {
    console.log("listen on 8081")
})

// export {clients}