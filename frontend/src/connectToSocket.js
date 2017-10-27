import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8081');

function sendToServer(key, value) {
    socket.emit(key, value)
}

export {sendToServer};