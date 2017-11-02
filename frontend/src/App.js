import React, {Component} from 'react';
import './App.css';
import {sendToServer, subscribe, userUse} from './connectToSocket';

class App extends Component {

    componentDidMount() {

        this.checkUser()

        subscribe('Error', (message) => {
            console.log(message)
        })

        userUse('Error', (message) => {
            alert(message)
            this.checkUser()
        })

        window.addEventListener("beforeunload", () => {
            sendToServer("disconect","")
        });

    }

    checkUser(){
        sendToServer('verif', prompt('nom : '))
    }

    render() {
        return (
            <div className="App">
                <h1>Communication avec socket.io !</h1>
            </div>
        );
    }
}

export default App;
