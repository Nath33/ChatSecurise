import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8081');

function subscribeToServer(callback) {
    socket.on('message', (name) => {
        callback(name)
    })
    socket.emit("pseudo", "user")
}

export {subscribeToServer};