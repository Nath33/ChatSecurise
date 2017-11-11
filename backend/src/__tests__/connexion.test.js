const openSocket = require('socket.io-client')
const app = require('../../../backend/app')
const options = {
    transports: ['websocket'],
    'force new connection': true
};

let socket
beforeEach(() => {
    socket = openSocket('http://localhost:8081', options);
    socket.emit("verif", "canard")
});

afterEach(() => {
    socket.emit("disconect", "canard")
});


describe('test socket', () => {
    test('It should add 1 client', (done) => {
        setTimeout(() => {
            expect(app.rooms.default.length).toBe(1)
            done()
        }, 500)
    });

    test('It should pop 1 client', (done) => {
        socket.emit("disconect", "")
        setTimeout(() => {
            expect(app.rooms.default.length).toBe(0)
            done()
        }, 500)
    });

    test('It should ask for pseudo client', (done) => {
        socket.emit("verif", "canard")
        socket.on('check', () => {
            done()
        })
    });
});