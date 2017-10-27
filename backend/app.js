var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)


io.sockets.on('connection', function (socket) {
    setInterval(()=>{
        socket.emit('message', "salut");
    },100)

    socket.on("pseudo", (pseudo)=> console.log(pseudo))
});

server.listen(8081);
