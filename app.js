const express = require("express");
const socketIo = require("socket.io");
const port = process.env.PORT || 3000;
const app = express();
const io = socketIo(server);


io.on("connection", socket => {
    console.log("New client connected"), setInterval(() => getApiAndEmit(socket), 10000)
    socket.on("disconnect", () => console.log("Client disconnected"));
})

const getApiAndEmit = async socket => {
    socket.emit("FromAPI", res.data.currently.temperature)
}

app.get("/", (req, res)=>{

}).listen(port, () => console.log(`Listening on port ${port}`))