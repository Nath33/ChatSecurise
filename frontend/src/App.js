import React, {Component} from 'react';
import './App.css';
import {disconnectFromServer, sendToServer, subscribeToServer} from './connectToSocket';

class App extends Component {

    componentDidMount() {
        let pseudo = prompt('nom : ')
        sendToServer('pseudo', pseudo)

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
