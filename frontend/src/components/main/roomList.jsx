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
				<div className="input-group">
					<input type="text" className="form-control" placeholder="RoomName" aria-label="roomname"
							aria-describedby="basic-addon2" onChange={this.handleNewValue} value={this.state.inputValue}/>
					<span className="input-group-addon" id="basic-addon2" onClick={this.createRoom}>Add</span>
				</div>
				{this.props.rooms.map((room, index) => <RoomRow key={index} click={this.handleChangeRoom} room={room}/>)}
			</div>
		)
	}
}


