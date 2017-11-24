import React from 'react'
import { subscribe } from './../../connectToSocket';
import RoomRow from '../row/roomRow';

export default class RoomList extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			inputValue: "",
			myRoom: '',
			display: false,
		}
	}

	componentDidUpdate() {
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

	makePop = () => {
		document.getElementById("hiddenDiv").style.display = "block";
	}

	closePop = () => {
		document.getElementById("hiddenDiv").style.display = "none";
	}


	render() {
		return (
			<div id="room_g" className="col-2">
				<div id="zone_rooms">
					<div className="input-group">
						<input type="text" className="form-control" placeholder="RoomName" aria-label="roomname"
							aria-describedby="basic-addon2" onChange={this.handleNewValue} value={this.state.inputValue} />
						<span className="input-group-addon" id="basic-addon2" onClick={this.createRoom}>Add</span>
					</div>
					{this.props.rooms.map((room, index) => <RoomRow key={index} click={this.handleChangeRoom} room={room} test={this.props.room} />)}
				</div>
				<div id="room_info">
					<div id="info_text">
						<h2>{this.props.pseudo}</h2>
						<p>Room actuelle :</p>
						<h4>{this.props.room}</h4>
					</div>
					<div id="hiddenDiv" >
						<div id="button_close_div">
							<button id='button_close' onClick={this.closePop}></button>
						</div>
						<p>wip</p>
					</div>
					<div id="info_button">
						<button id="button_param" className="btn" onClick={this.makePop}>
						</button>
					</div>
				</div>
			</div>
		)
	}
}


