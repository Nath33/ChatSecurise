import React from 'react';
import 'styles/index.scss';
import {sendToServer, subscribe, userUse} from './connectToSocket';


export default class App extends React.Component {
	componentDidMount() {
		App.checkUser()
		subscribe('Error', (message) => {
			console.log(message)
		})

		userUse('Error', (message) => {
			alert(message)
			App.checkUser()
		})

		window.addEventListener("beforeunload", () => {
			sendToServer("disconect", "")
		});
	}

	static checkUser() {
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
