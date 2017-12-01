import React from 'react'
import {subscribe} from './../../connectToSocket';
import RoomRow from '../row/roomRow';

export default class RoomList extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			inputValue: "",
			myRoom: '',
			display: false,
			inputPseudo: '',
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
		this.setState({
			inputValue : "",
		})
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

	handleEnterPress = (target) => {
		//13 = la touche entrée
		if(target.charCode===13){
			this.createRoom()
		}
	}

	//onClick params button
     makePop = () => {
		if(this.state.display === false){
			document.getElementById("hiddenDiv").style.display = "block"
			this.setState({
				display: true,
			 })
		} else if ( this.state.display === true){
			document.getElementById("hiddenDiv").style.display = "none";
			this.setState({
				display: false,
			})
		}
     }

	 //onClick quit button in hiddendiv
     closePop = () => {
		document.getElementById("hiddenDiv").style.display = "none";
	    this.setState({
			display: false,
		})
	}

	render() {
		return (
			<div id="room_g" className="col-2">
				<div id="zone_rooms">
					<div className="input-group">
						<input type="text" className="form-control" placeholder="Créer une salle" aria-label="roomname"
								aria-describedby="basic-addon2" onChange={this.handleNewValue} value={this.state.inputValue} onKeyPress={this.handleEnterPress}/>
						<span className="input-group-addon" id="basic-addon2" onClick={this.createRoom}>Créer</span>
					</div>
					{this.props.rooms.map((room, index) => <RoomRow key={index} click={this.handleChangeRoom} room={room} test={this.props.room}/>)}
				</div>
				<div id="room_info">
					<div id="info_text">
						<h2>{this.props.pseudo}</h2>
						<p>Salle actuelle :</p>
						<h4>{this.props.room}</h4>
					</div>
					<div id="hiddenDiv">
						<div id="button_close_div">
							<button id='button_close' onClick={this.closePop}></button>
						</div>
						<div className="input-group">
						<input type="text" className="form-control" placeholder="Changer Pseudo" aria-label="changepseudo"
								aria-describedby="basic-addon2" onChange={this.handleNewValue} value={this.state.inputPseudo} onKeyPress={this.handleEnterPress}/>
						<span className="input-group-addon" id="basic-addon2" >Change</span>
					</div>
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
