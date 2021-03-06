import React from 'react';
import 'styles/index.scss';
import 'styles/darkstyle.css';
import 'styles/lightstyle.css';
import 'styles/pinkstyle.css';
import UserList from 'components/main/userList';
import RoomList from 'components/main/roomList';
import Chat from 'components/main/chat';

import { sendToServer, subscribe } from './connectToSocket';

export default class App extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			messages: [],
			users: [],
			rooms: [],
			myRoom: "",
			pseudo: "",
			messageTemp: "",
			key: 'Guadeloupe',
		}
	}

	componentDidMount() {

		this.checkUser()

		subscribe('Error', (message) => {
			console.log(message)
		})

		subscribe('check', (message) => {
			alert(message)
			this.checkUser()
		})

		subscribe('List', (message) => {
			this.setState({
				users: JSON.parse(message)
			})
		})

		subscribe('listRoom', (rooms) => {
			this.setState({
				rooms: JSON.parse(rooms)
			})
		})

		subscribe('yourRoom', (jsonRoom) => {
			this.setState({
				myRoom: JSON.parse(jsonRoom),
				messages: [],
			})
		})

		subscribe('setPassword', (newRoom) => {
			let password
			do {
				password = prompt('password :')
			} while (password.length === 0 || !password.replace(/\s/g, '').length)
			sendToServer('setPasswordRoom', JSON.stringify({ newRoom: newRoom, password: password }))
		})

		subscribe('passwordAsk', (newRoom) => {
			let password = prompt('password :')
			sendToServer('checkPassword', JSON.stringify({ password: password, newRoom: newRoom }))
		})

		subscribe('message', (jsonMessage) => {
			let message = JSON.parse(jsonMessage)
			let newMessagesList = this.state.messages
			let decryptMessage = ""
			if ((this.state.myRoom.substr(this.state.myRoom.lastIndexOf('-'), 6)) == '- lock') {
				sendToServer('getPwd', message)
			} else {
				decryptMessage = this.decryptage(message.message, this.cryptage(this.state.myRoom, this.state.key))
				newMessagesList.push({ pseudo: message.pseudo, message: decryptMessage, date: new Date() })
				this.setState({
					messages: newMessagesList
				})
				let elem = document.getElementById('text');
				elem.scrollTop = elem.scrollHeight;
			}
		})

		subscribe('messageServ', (jsonMessage) => {
			let message = JSON.parse(jsonMessage)
			let newMessagesList = this.state.messages
			let messageRoom = message.message
			newMessagesList.push({ pseudo: message.pseudo, message: messageRoom, date: new Date() })
			this.setState({
				messages: newMessagesList
			})
			let elem = document.getElementById('text');
			elem.scrollTop = elem.scrollHeight;
		})

		subscribe('alertServer', (data) => {
			alert(data)
		})

		subscribe('reloader', (data) => {
			alert(data)
			location.reload()
		})

		subscribe('returnGetPassword', (data) => {
			if (this.state.messageTemp != "") {
				let message = this.cryptage(this.cryptage(this.state.messageTemp, data), this.cryptage(this.state.myRoom, this.state.key))
				this.setState({
					messageTemp: ""
				})
				console.log(this.state.messageTemp)
				sendToServer("message", message)
			} else {
				let message = JSON.parse(data)
				let newMessagesList = this.state.messages
				let decryptMessage = this.decryptage(this.decryptage(message.message.message, message.pass), this.cryptage(this.state.myRoom, this.state.key))

				newMessagesList.push({ pseudo: message.message.pseudo, message: decryptMessage, date: new Date() })
				this.setState({
					messages: newMessagesList
				})

				let elem = document.getElementById('text');
				elem.scrollTop = elem.scrollHeight;
			}
		})

		window.addEventListener("beforeunload", () => {
			sendToServer("disconnect", "")
		});
	}

	checkUser = () => {
		let pseudo = prompt('nom : ')
		sendToServer('verif', pseudo)
		this.setState({ pseudo: pseudo })
	}

	handleSendMessage = (message) => {
		if (message.length !== 0) {
			if ((this.state.myRoom.substr(this.state.myRoom.lastIndexOf('-'), 6)) == '- lock') {
				this.setState({
					messageTemp: message
				})
				sendToServer('getPwd')
			} else {
				sendToServer("message", this.cryptage(message, this.cryptage(this.state.myRoom, this.state.key)))
			}
		}
	}

	handleChangeRoom = (roomName, passwordRequired) => {
		if (roomName.trim() === "")
			alert("Room vide")
		else
			if (passwordRequired)
				sendToServer("changeRoomPassword", JSON.stringify({ newRoom: roomName }))
			else
				sendToServer("changeRoom", JSON.stringify({ newRoom: roomName }))
	}

	cryptage = (phrase, cle) => {
		let coordphrase = new Array();
		let coordphrase_cle = new Array();
		let newcoord = new Array();
		let coordcrypt = new Array();
		let alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789àâéêèëîïôöçù',!?.;:=+-()/@%$* ";
		let crypt = "";
		let phrase_cle = "";
		var car = 0;
		for (var z = 0; z < phrase.length; z++) {
			phrase_cle += cle.charAt(car);
			car++;
			if (car == cle.length)
				car = 0;
		}
		for (var k = 0; k < phrase.length; k++) {
			for (var p = 0; p < alpha.length; p++) {
				if (phrase.charAt(k) == alpha.charAt(p))
					coordphrase[k] = p;
				if (phrase_cle.charAt(k) == alpha.charAt(p))
					coordphrase_cle[k] = p;
			}
			newcoord[k] = coordphrase[k] + coordphrase_cle[k];
			if (newcoord[k] > alpha.length - 1)
				newcoord[k] -= alpha.length;
			crypt += alpha.charAt(newcoord[k]);
		}
		return crypt;
	}

	decryptage = (crypt, cle) => {
		let coordphrase = new Array();
		let coordphrase_cle = new Array();
		let newcoord = new Array();
		let coordcrypt = new Array();
		let alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789àâéêèëîïôöçù',!?.;:=+-()/@%$* ";
		let decrypt = "";
		let phrase_cle = "";
		var car = 0;
		for (var o = 0; o < crypt.length; o++) {
			for (var b = 0; b < alpha.length; b++) {
				if (crypt.charAt(o) == alpha.charAt(b))
					coordcrypt[o] = b;
			}
		}
		for (var z = 0; z < crypt.length; z++) {
			phrase_cle += cle.charAt(car);
			car++;
			if (car == cle.length)
				car = 0;
		}
		for (var y = 0; y < phrase_cle.length; y++) {
			for (var u = 0; u < alpha.length; u++) {
				if (phrase_cle.charAt(y) == alpha.charAt(u))
					coordcrypt[y] -= u;
				if (coordcrypt[y] < 0)
					coordcrypt[y] += alpha.length;
			}
		}
		for (var t = 0; t < crypt.length; t++) {
			decrypt += alpha.charAt(coordcrypt[t]);
		}
		return decrypt;
	}

	render() {
		return (
			<div className="row">
				<RoomList rooms={this.state.rooms}
					onClick={this.handleChangeRoom}
					pseudo={this.state.pseudo}
					room={this.state.myRoom}
				/>
				<Chat messages={this.state.messages}
					pseudo={this.state.pseudo}
					room={this.state.myRoom}
					onSend={this.handleSendMessage}
				/>
				<UserList users={this.state.users} />
			</div>
		);
	}
}
