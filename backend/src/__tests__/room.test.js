const openSocket = require('socket.io-client')

const app = require('../../../backend/app')
const options = {
    transports: ['websocket'],
    'force new connection': true
};

describe('test room', () => {
    test('It should add 1 room', (done) => {
        let socket = openSocket('http://localhost:8081', options);
        socket.emit("verif", "canard")
        socket.emit("createRoom", JSON.stringify({newRoom: "room2"}))
        setTimeout(() => {
            expect(app.rooms.room2.length).toBe(1);
            done()
        }, 500)
    });

    test('It should leave the room', (done) => {
        let socket = openSocket('http://localhost:8081', options);
        socket.emit("verif", "canard")
        socket.emit("createRoom", JSON.stringify({newRoom: "room2"}))
        socket.emit("changeRoom", JSON.stringify({newRoom: "default"}))
        setTimeout(() => {
            expect(app.rooms.room2).toBe(undefined);
            expect(app.rooms.default.length).toBe(1);
            done()
        }, 500)
    });

    test('It should list 2 rooms', (done) => {
        let i = 0;
        let socket = openSocket('http://localhost:8081', options);
        socket.emit("verif", "canard")
        socket.emit("createRoom", JSON.stringify({newRoom: "room2"}))
        socket.on("listRoom", (jsonList => {
            if(i === 1){
                let list = JSON.parse(jsonList)
                expect(list[0]).toBe("default");
                expect(list[1]).toBe("room2");
                done()
            }
            i++
        }))
        let call = 0
        socket.on("List", (jsonUserList => {
            if(call === 1){
                expect(JSON.parse(jsonUserList).length).toBe(1);
                done()
            }
            call++
        }))
    });

    test('It should invites a user in my room', (done) => {
        let client1 = openSocket('http://localhost:8081', options);
        let client2 = openSocket('http://localhost:8081', options);

        client1.emit("verif", "canard")
        client2.emit("verif", "canard2")

        client1.emit("createRoom", JSON.stringify({newRoom: "room2"}))
        client1.emit("inviteRoom", JSON.stringify({newRoom: "room2", oldRoom: "default", "pseudo": "canard2"}))

        setTimeout(()=>{
            expect(app.rooms.room2.length).toBe(2)
            expect(app.rooms.default.length).toBe(0)
            done()
        }, 500)
    });
});