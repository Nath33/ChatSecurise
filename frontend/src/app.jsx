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
			newMessagesList.push({pseudo: message.pseudo, message: message.message, date: new Date()})
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
		sendToServer("message", message)
	}

	handleChangeRoom = (roomName) => {
		if (roomName.trim() === "") {
			alert("Room vide")
		}
		else {
			sendToServer("changeRoom", JSON.stringify({newRoom: roomName}))
		}
	}

	render() {
		return (
			<div className="row">
				<RoomList rooms={this.state.rooms} onClick={this.handleChangeRoom}/>
				<Chat messages={this.state.messages} pseudo={this.state.pseudo} room={this.state.myRoom}
							onSend={this.handleSendMessage}/>
				<UserList users={this.state.users}/>
			</div>
		);
	}
}
