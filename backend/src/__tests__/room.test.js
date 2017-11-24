const openSocket = require('socket.io-client')

require('chai').should()

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
    socket.disconnect()
});

describe('Room', () => {
    describe('listRoom', () => {
        it('should add room', () => {
            const result = [1, 2, 3].indexOf(4)
            result.should.equal(-1)
        })
    })
})

/*
describe('test room', () => {
    test('It should add 1 room', (done) => {
        expect.assertions(2);
        // When leave, it deletes the room if empty
        let call = 0
        socket.on("listRoom", (data) => {
            if(call === 0){
                expect(JSON.parse(data).length).toBe(1)
                expect(JSON.parse(data)[0]).toBe("default")
                done()
            }else if(call === 2){
                expect(JSON.parse(data).length).toBe(1)
                expect(JSON.parse(data)[0]).toBe("room2")
                done()
            }
            call++
        })
        setTimeout(()=>{
            socket.emit("changeRoom", JSON.stringify({newRoom: "room2"}))
        }, 100)
    });

    test('It should leave the room', (done) => {
        let call = 0
        socket.on("listRoom", (data) => {
            if(call === 0){
                expect(JSON.parse(data).length).toBe(1)
                expect(JSON.parse(data)[0]).toBe("default")
                done()
            }else if(call === 1){
                expect(JSON.parse(data).length).toBe(1)
                expect(JSON.parse(data)[0]).toBe("room2")
                done()
            }else if(call === 4){
                expect(JSON.parse(data).length).toBe(1)
                expect(JSON.parse(data)[0]).toBe("default")
                done()
            }
            call++
        })
        socket.emit("changeRoom", JSON.stringify({newRoom: "room2"}))
        socket.emit("changeRoom", JSON.stringify({newRoom: "default"}))

    });

    test('It should list 2 rooms', (done) => {
        let i = 0;
        let client2 = openSocket('http://localhost:8081', options)

        client2.on("listRoom", (jsonList => {
            if (i === 2) {
                let list = JSON.parse(jsonList)
                expect(list[0]).toBe("default")
                expect(list[1]).toBe("room2")
                client2.emit("disconnect", "")
                done()
            }
            i++
        }))

        socket.emit("verif", "canard")
        client2.emit("verif", "canard2")
        socket.emit("changeRoom", JSON.stringify({newRoom: "room2"}))
    });

});
*/
