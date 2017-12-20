function leaveRoom(socket) {
    let roomName = socket.room;
    messageRoom(socket, 'leave')
    socket.leave(roomName)
    socket.room = undefined
    sendListUserRoom(roomName)
}

function sendListUserRoom(room) {
    io.to(room).emit("List", JSON.stringify(listUserRoom(room)));
}

function joinRoom(roomName) {
    socket.room = roomName
    socket.join(socket.room)
    messageRoom(socket, 'join')
    sendListUserRoom(socket.room);
}

function listUserRoom(room) {
    let listUser = []
    for (const sock in io.in(room).connected) {
        if (
            io.in(room).connected.hasOwnProperty(sock) &&
            io.in(room).connected[sock].room === room
        )
            listUser.push(io.in(room).connected[sock].pseudo)
    }
    return listUser
}

function sendYourRoom(socket) {
    socket.emit("yourRoom", JSON.stringify(socket.room));
}

function getConnectedSocketIdsList() {
    let ids = []
    for (const id in io.sockets.connected) {
        if (io.sockets.adapter.rooms.hasOwnProperty(id))
            ids.push(id)
    }
    return ids
}

function sendEveryOneListRoom() {
    let listRooms = []
    let connectedSocketIds = getConnectedSocketIdsList()
    for (const room in io.sockets.adapter.rooms) {
        if (
            io.sockets.adapter.rooms.hasOwnProperty(room) &&
            connectedSocketIds.indexOf(room) === -1
        )
            listRooms.push(room)
    }
    io.sockets.emit('listRoom', JSON.stringify(listRooms))
}

function isPseudoFree(rooms, pseudo) {
    for (const sock in io.in(rooms).connected) {
        if (
            io.in(rooms).connected.hasOwnProperty(sock) &&
            io.in(rooms).connected[sock].pseudo === pseudo
        )
            return false
    }
    return true
}


}
