const app = require('express')(),
    serveur = require('http').createServer(app),
    openSocket = require('socket.io-client')  

require('./socket')(serveur)

const options = {
    transports: ['websocket'],
    'force new connection': true
}

let socket = openSocket('http://localhost:8081', options);

socket.emit("verif", "Admin")
//global.adminSocket = socket
global.roomPassword = []

serveur.listen(8081, () => {

    console.log("listen on 8081")
})

module.exports = app