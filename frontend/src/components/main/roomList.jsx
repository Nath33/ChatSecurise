import React from 'react'
import RoomRow from '../row/roomRow';

export default class RoomList extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			inputValue: ""
		}
	}

	handleNewValue = (evt) => {
		this.setState({
			inputValue: evt.target.value
		})
	}

	createRoom = () => {
		this.props.onClick(this.state.inputValue)
	}

	handleChangeRoom = (roomName) => {
		this.props.onClick(roomName)
	}

	render() {
		return (
			<div id="zone_rooms" className="col-2">
				<input onChange={this.handleNewValue} value={this.state.inputValue}/>
				<button onClick={this.createRoom}>Créer une room</button>
				{this.props.rooms.map((room, index) => <RoomRow key={index} click={this.handleChangeRoom} room={room}/>)}
			</div>
		)
	}
}


