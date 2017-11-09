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
		}
	}

	componentDidMount() {
		App.checkUser()
		subscribe('Error', (message) => {
			console.log(message)
		})

		subscribe('check', (message) => {
			alert(message)
			App.checkUser()
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

	static checkUser() {
		sendToServer('verif', prompt('nom : '))
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

	render() {
		console.log(this.state.rooms)
		return (
			<div>
				<div className="row">
					<div id="zone_rooms" className="col-1">
						{this.state.rooms.map((room, index) => <RoomRow key={index} room={room}/>)}
					</div>
					<div id="zone_chat" className="col-9">
						<div id="room">
							<h3>#Room</h3>
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
