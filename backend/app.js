var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)
var Client = require('./src/Client')

let clients = []
console.log("Starting socket")
io.sockets.on('connection', function (socket) {

    function getListUser(){
        let listUser = []
        clients.forEach(function(item) {
            listUser.push(item.getPseudo());
        });
        JSON.stringify(listUser);
        socket.emit("List", listUser);
        socket.broadcast.emit("List", listUser);
    }

    socket.on("verif", pseudo => {
        let client = new Client(pseudo,socket)
        console.log(client.getPseudo())
        if (clients.findIndex(elt => elt.getPseudo() === pseudo) === -1) {
            clients.push(client);
            getListUser()

        } else {
            socket.emit("check", "Identifiant déjà utilisé");
        }
    })

    socket.on('disconect', () => {
        clients.splice(clients.findIndex(elt => elt.getSocket() === socket), 1)
        getListUser()
    })

    socket.on('message', (message) => {
        let pseudo = clients[clients.findIndex(elt => elt.getSocket() === socket)].getPseudo()
        for (let index in clients) {
            clients[index].getSocket().emit("message", JSON.stringify({message: message, pseudo: pseudo}))
        }
    })
});

server.listen(8081, () => {
    console.log("listen on 8081")
})

// export {clients}