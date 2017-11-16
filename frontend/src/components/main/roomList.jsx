import React from 'react'
import {subscribe} from './../../connectToSocket';
import RoomRow from '../row/roomRow';

export default class RoomList extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			inputValue: "",
			myRoom: ''
		}
	}

	componentDidUpdate(){
		subscribe('yourRoom', (jsonRoom) => {
			this.setState({
				myRoom: JSON.parse(jsonRoom),
			})
		})
	}

	handleNewValue = (evt) => {
		this.setState({
			inputValue: evt.target.value
		})
	}

	createRoom = () => {
		this.props.onClick(this.state.inputValue)
		/*
		subscribe('yourRoom', (jsonRoom) => {
			this.setState({
				myRoom: JSON.parse(jsonRoom),
			})
		})
		*/
	}

	handleChangeRoom = (roomName) => {
		this.props.onClick(roomName)
	}

	render() {
		return (
			<div id="room_g" className="col-2">
				<div id="zone_rooms">
					<div className="input-group">
						<input type="text" className="form-control" placeholder="RoomName" aria-label="roomname"
								aria-describedby="basic-addon2" onChange={this.handleNewValue} value={this.state.inputValue}/>
						<span className="input-group-addon" id="basic-addon2" onClick={this.createRoom}>Add</span>
					</div>
					{this.props.rooms.map((room, index) => <RoomRow key={index} click={this.handleChangeRoom} room={room} test={this.props.room}/>)}
				</div>
				<div id="room_info">
					<h2>{this.props.pseudo}</h2>
					<p>Actuellement dans:</p>
					<h4>{this.props.room}</h4>
				</div>
			</div>
		)
	}
}


