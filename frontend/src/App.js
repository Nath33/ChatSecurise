import React, {Component} from 'react';
import './App.css';
import {sendToServer, subscribe, userUse} from './connectToSocket';

class App extends Component {

    componentDidMount() {
        let pseudo = ""
        pseudo = prompt('nom : ')

        sendToServer('verif', pseudo)
        subscribe('Error', (message) => {
            console.log(message)
        })

        userUse('Error', (message) => {
            alert(message)
            pseudo = prompt('nom : ')
            sendToServer('verif', pseudo)
        })

        window.addEventListener("beforeunload", () => {
            sendToServer("disconect","")
        });

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
