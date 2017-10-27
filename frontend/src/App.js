import React, {Component} from 'react';
import './App.css';
import {subscribeToServer} from './connectToSocket';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "Connexion..."
        }

        subscribeToServer((name) => {
                this.setState({
                    message: this.state.message + "<br />" + name
                })
            }
        )
    }

    render() {
        return (
            <div className="App">
                <h1>Communication avec socket.io !</h1>
                <p>{this.state.message}</p>
            </div>
        );
    }
}

export default App;
