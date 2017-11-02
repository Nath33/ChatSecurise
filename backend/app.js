var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)

let clients = []
console.log("Starting socket")
io.sockets.on('connection', function (socket) {

    socket.on("pseudo", pseudo => clients.push({pseudo: pseudo, socket: socket}))

    socket.on('disconect', () => {
        clients.splice(clients.findIndex(elt => elt.socket === socket), 1)
    })
});

server.listen(8081, () => {
    console.log("listen on 8081")
})

export {clients}