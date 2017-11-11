const openSocket = require('socket.io-client')
const app = require('../../../backend/app')

const options = {
    transports: ['websocket'],
    'force new connection': true
};

let client1
let client2
beforeEach(() => {
    client1 = openSocket('http://localhost:8081', options);
    client1.emit("verif", "canard")
    client2 = openSocket('http://localhost:8081', options);
    client2.emit("verif", "foo")
});

afterEach(() => {
    client1.emit("disconect", "")
    client2.emit("disconect", "")
});


describe('test send messages', () => {
    test('It should send message to everyone in default room', (done) => {
        let message = "foo"

        setTimeout(() => {
            client1.emit("message", message)
        }, 1000)

        client2.on('message', (msg) => {
            let data = JSON.parse(msg)
            expect(data.message).toBe("foo")
            expect(data.pseudo).toBe("canard")
            done()
        })
    });

    test('It should send message to everyone in myRoom room', (done) => {
        let message = "foo"
        client1.emit("createRoom", JSON.stringify({newRoom: "room2"}))
        client2.emit("changeRoom", JSON.stringify({newRoom: "room2"}))

        setTimeout(() => {
            client1.emit("message", message)
        }, 500)

        client2.on('message', (msg) => {
            let data = JSON.parse(msg)
            expect(data.message).toBe("foo")
            expect(data.pseudo).toBe("canard")
            done()
        })
    });

    test('It should not send message to mulitple room', (done) => {
        let message = "foo"
        client1.emit("createRoom", JSON.stringify({newRoom: "room2"}))

        setTimeout(() => {
            client1.emit("message", message)
        }, 500)

        client1.on('message', (msg) => {
            let data = JSON.parse(msg)
            expect(data.message).toBe("foo")
            expect(data.pseudo).toBe("canard")
            done()
        })

        client2.on('message', () => {
            fail()
        })
    });
});