const app = require('../../../backend/app')
import openSocket from 'socket.io-client'

const options = {
    transports: ['websocket'],
    'force new connection': true
};


describe('test send messages', () => {
    test('It should send message to everyone', (done) => {
        let client1 = openSocket('http://localhost:8081', options);
        let client2 = openSocket('http://localhost:8081', options);
        let message = "foo"
        let pseudo = "canard"

        client1.emit("verif", pseudo)
        client2.emit("verif", "client2")

        setTimeout(() => {
            client1.emit("message", message)
        }, 500)

        client2.on('message', (msg) => {
            let data = JSON.parse(msg)
            expect(data.message).toBe(message)
            expect(data.pseudo).toBe(pseudo)
            done()
        })
    });


    test('It should send message to client2 only', (done) => {
        let client1 = openSocket('http://localhost:8081', options);
        let client2 = openSocket('http://localhost:8081', options);
        let client3 = openSocket('http://localhost:8081', options);

        let message = "foo"
        let pseudoClient1 = "canard"

        client1.emit("verif", pseudoClient1)
        client2.emit("verif", "client2")
        client3.emit("verif", "client3")

        setTimeout(() => {
            client1.emit("privateMessage", JSON.stringify({message: message, pseudo: "client2"}))
        }, 500)

        client2.on('message', (msg) => {
            let data = JSON.parse(msg)
            expect(data.message).toBe(message)
            expect(data.pseudo).toBe(pseudoClient1)
            done()
        })

        client3.on('message', (msg) => {
            fail()
        })
    });

    test('It should send message to client2 && client3 only', (done) => {
        expect.assertions(2);
        let client1 = openSocket('http://localhost:8081', options);
        let client2 = openSocket('http://localhost:8081', options);
        let client3 = openSocket('http://localhost:8081', options);
        let client4 = openSocket('http://localhost:8081', options);

        let message = "foo"
        let pseudoClient1 = "canard"

        client1.emit("verif", pseudoClient1)
        client2.emit("verif", "client2")
        client3.emit("verif", "client3")
        client4.emit("verif", "client4")

        setTimeout(() => {
            client1.emit("privateMessage", JSON.stringify({message: message, pseudo: ["client2", "client3"]}))
        }, 500)

        client2.on('message', (msg) => {
            let data = JSON.parse(msg)
            expect(data.message).toBe(message)
            expect(data.pseudo).toBe(pseudoClient1)
            done()
        })

        client3.on('message', (msg) => {
            let data = JSON.parse(msg)
            expect(data.message).toBe(message)
            expect(data.pseudo).toBe(pseudoClient1)
            done()
        })

        client4.on('message', (msg) => {
            fail()
        })
    });
});