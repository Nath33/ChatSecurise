import React, {Component} from 'react';
import './App.css';
import {sendToServer, subscribe} from './connectToSocket';

class App extends Component {

    componentDidMount() {
        let pseudo = prompt('nom : ')

        sendToServer('verif', pseudo)
        subscribe('Error', (message) => {
            console.log(message)
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
