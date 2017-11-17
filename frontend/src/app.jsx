import React from 'react';
import 'styles/index.scss';
import UserList from 'components/main/userList';
import RoomList from 'components/main/roomList';
import Chat from 'components/main/chat';

import {sendToServer, subscribe} from './connectToSocket';


export default class App extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			messages: [],
			users: [],
			rooms: [],
			myRoom: "",
			pseudo: "",
			key:'guadeloupe'
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
			console.log(message)
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

		subscribe('message', (jsonMessage) => {
			let message = JSON.parse(jsonMessage)
			let newMessagesList = this.state.messages
			let decryptMessage=this.decryptage(message.message,this.state.key)
			newMessagesList.push({pseudo: message.pseudo, message: decryptMessage, date: new Date()})
			this.setState({
				messages: newMessagesList
			})
			let elem = document.getElementById('text');
			elem.scrollTop = elem.scrollHeight;
		})

		window.addEventListener("beforeunload", () => {
			sendToServer("disconnect", "")
		});
	}

	checkUser = () => {
		let pseudo = prompt('nom : ')
		sendToServer('verif', pseudo)
		this.setState({pseudo: pseudo})
	}

	handleSendMessage = (message) => {
		console.log("Send to everyone", message)
		sendToServer("message", this.cryptage(message,this.state.key))
	}

	handleChangeRoom = (roomName) => {
		if (roomName.trim() === "") {
			alert("Room vide")
		}
		else {
			sendToServer("changeRoom", JSON.stringify({newRoom: roomName}))
		}
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
				<RoomList rooms={this.state.rooms} onClick={this.handleChangeRoom} pseudo={this.state.pseudo} room={this.state.myRoom}/>
				<Chat messages={this.state.messages} pseudo={this.state.pseudo} room={this.state.myRoom}
							onSend={this.handleSendMessage}/>
				<UserList users={this.state.users}/>
			</div>
		);
	}
}
