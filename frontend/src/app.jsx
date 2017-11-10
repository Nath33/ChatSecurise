import React from 'react';
import 'styles/index.scss';
import Row from 'core/row';
import UserRow from 'core/userRow';
import RoomRow from 'core/roomRow';
import {sendToServer, subscribe} from './connectToSocket';


export default class App extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: "",
			data: [],
			users: [],
			rooms: [],
			myRoom: "",
			pseudo: "",
			inputRoom: "",
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
						data: [],
					})
				})

		subscribe('message', (data) => {
			console.log(data)
			let value = JSON.parse(data)
			let newVal = this.state.data
			newVal.push({pseudo: value.pseudo, message: value.message, date: new Date()})
			this.setState({
				data: newVal
			})
			let elem = document.getElementById('text'); //chat container's ID where your messages stack up.
			elem.scrollTop = elem.scrollHeight;

		})

		window.addEventListener("beforeunload", () => {
			sendToServer("disconect", "")
		});
	}

	checkUser = () => {
		let pseudo = prompt('nom : ')
		sendToServer('verif', pseudo)
		this.setState({pseudo:pseudo})
	}

	update = (evt) => {
		this.setState({
			value: evt.target.value
		})
	}


	send = (evt) => {
		console.log("Send to everyone", this.state.value)
		sendToServer("message", this.state.value)

		this.setState({
			value: ""
		})
	}

	handleInputRoom = (evt)=>{
		this.setState({
			inputRoom:evt.target.value
		})
	}
	createRoom = ()=>{
		if(this.state.inputRoom.trim() === ""){alert("Room vide")}
		else {sendToServer("createRoom", JSON.stringify({newRoom: this.state.inputRoom}))}
	}
	handleChangerRoom = (roomName) =>{
		sendToServer("changeRoom", JSON.stringify({newRoom: roomName}))
	}

	render() {
		return (
			<div>
				<div className="row">
					<div id="zone_rooms" className="col-2">
						<input onChange={this.handleInputRoom} value={this.state.inputRoom}/>
						<button onClick={this.createRoom}>Créer une room</button>
						{this.state.rooms.map((room, index) => <RoomRow key={index} click={this.handleChangerRoom} room={room}/>)}
					</div>
					<div id="zone_chat" className="col-8">
						<div id="room">
							<h3>{this.state.pseudo} -#Room - {this.state.myRoom}</h3>
						</div>
						<div className="App">
							<div id="text">
								<div id="msg">
									<ul>
										{this.state.data.map((post, index) => <li key={index}><Row data={post}/></li>)}
									</ul>
								</div>
							</div>
						</div>
						<div className="input-group">
							<input type="text" className="form-control" placeholder="Message" aria-label="message"
										 aria-describedby="basic-addon2" value={this.state.value} onChange={this.update}/>
							<span className="input-group-addon" id="basic-addon2" onClick={this.send}>Send</span>
						</div>
					</div>
					<div id="zone_users" className="col-2">
						<div className="input-group">
							<input type="text" className="form-control" placeholder="Username" aria-label="username"
										 aria-describedby="basic-addon2"/>
							<span className="input-group-addon" id="basic-addon2">Search</span>
						</div>
						<div id="users">
							{this.state.users.map((user, index) => <UserRow key={index} user={user}/>)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
