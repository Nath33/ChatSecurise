module.exports = function (io, socket) {
    return {
        message: (message) => {
            console.log(message)//a garder pour montrer le cryptage (NICO DEPERO)
            io.to(socket.room).emit("message", JSON.stringify({ message: message, pseudo: socket.pseudo }));
        }
    }
}