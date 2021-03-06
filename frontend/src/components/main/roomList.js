import React from 'react'
import { subscribe, sendToServer } from './../../connectToSocket';
import RoomRow from '../row/roomRow';

export default class RoomList extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			inputValue: "",
			myRoom: '',
			display: false,
			inputPseudo: '',
			theme: 'light',
		}
	}

	componentDidUpdate() {

		subscribe('yourRoom', (jsonRoom) => {
			this.setState({
				myRoom: JSON.parse(jsonRoom),
			})
		})
		subscribe('newPseudo', (data) => {
			const { newPseudo } = JSON.parse(data)
			document.getElementById('pseudo').innerHTML = newPseudo
		})
	}

	handleNewValue = (evt) => {
		this.setState({
			inputValue: evt.target.value
		})
	}

	handleNewValuePseudo = (value) => {
		this.setState({
			inputPseudo: value.target.value
		})
	}

	createRoom = () => {
		this.props.onClick(this.state.inputValue, document.getElementById('passwordRequired').checked)
		document.getElementById('passwordRequired').checked = false
		this.setState({
			inputValue: "",
		})
	}

	changeColor = () => {
		if (document.getElementById('changeColor1').checked === true) {
			document.getElementById("MyBody").classList.remove('dark')
			document.getElementById("MyBody").classList.remove('pink')
			document.getElementById("MyBody").classList.add('light')
			document.getElementById('changeColor1').checked = false
			this.setState({
				theme: 'light',
			})
			document.getElementById('spanLight').style.display = 'none'
			document.getElementById('spanDark').style.display = 'block'
			document.getElementById('spanPink').style.display = 'block'
		} else if (document.getElementById('changeColor2').checked === true) {
			document.getElementById("MyBody").classList.add('dark')
			document.getElementById("MyBody").classList.remove('pink')
			document.getElementById("MyBody").classList.remove('light')
			document.getElementById('changeColor2').checked = false
			this.setState({
				theme: 'dark',
			})
			document.getElementById('spanLight').style.display = 'block'
			document.getElementById('spanDark').style.display = 'none'
			document.getElementById('spanPink').style.display = 'block'
		} else if (document.getElementById('changeColor3').checked === true) {
			document.getElementById("MyBody").classList.remove('dark')
			document.getElementById("MyBody").classList.add('pink')
			document.getElementById("MyBody").classList.remove('light')
			document.getElementById('changeColor3').checked = false
			this.setState({
				theme: 'pink',
			})
			document.getElementById('spanLight').style.display = 'block'
			document.getElementById('spanDark').style.display = 'block'
			document.getElementById('spanPink').style.display = 'none'
		} else {
			document.getElementById("MyBody").classList.remove('dark')
			document.getElementById("MyBody").classList.remove('pink')
			document.getElementById("MyBody").classList.add('light')
			this.setState({
				theme: 'light',
			})
			document.getElementById('spanLight').style.display = 'none'
			document.getElementById('spanDark').style.display = 'block'
			document.getElementById('spanPink').style.display = 'block'
		}
	}

	handleChangeRoom = (roomName) => {
		this.props.onClick(roomName)
	}

	handleChangePseudo = (newPseudo) => {
		sendToServer('changePseudo', JSON.stringify({ newPseudo: this.state.inputPseudo }))
		document.getElementById('changepseudo').value = ""
		document.getElementById("hiddenDiv").style.display = "none"
		this.setState({
			display: false
		})
	}

	handlePseudoPress = (target) => {
		if (target.charCode === 13) //13 = la touche entrée
			this.handleChangePseudo()
	}

	handleEnterPress = (target) => {
		if (target.charCode === 13) //13 = la touche entrée
			this.createRoom()
	}

	//onClick params button
	makePop = () => {
		if (this.state.display === false) {
			document.getElementById("hiddenDiv").style.display = "block"
			this.setState({
				display: true,
			})
		} else if (this.state.display === true) {
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

	countElement = () => {
		let count = 0
		this.props.rooms.map((room, index) => count++)
		if (count < 2)
			return "Il y a " + count + " room"
		else
			return "Il y a " + count + " rooms"
	}

	render() {
		return (
			<div id="room_g" className="col-2">
				<div id="zone_rooms">
					<div className="input-group">
						<input type="text"
							className="form-control"
							placeholder="Créer une salle"
							onChange={this.handleNewValue}
							value={this.state.inputValue}
							onKeyPress={this.handleEnterPress}
						/>
						<span className="input-group-addon"
							onClick={this.createRoom}>Créer
						</span>
					</div>
					<div id="security">
						<div className="input-group">
							<p> Sécuriser la room </p>
  							<p>
								<input id="passwordRequired" type="checkbox" />
								<label htmlFor="passwordRequired">
									<span className="ui"></span>
								</label>
							</p>
						</div>
					</div>
					<p className="nbItem">{this.countElement()}</p>
					{this.props.rooms.map((room, index) => <RoomRow key={index} click={this.handleChangeRoom} room={room} test={this.props.room} />)}
				</div>
				<div id="room_info">
					<div id="info_text">
						<h2 id='pseudo'>{this.props.pseudo}</h2>
						<p>Salle actuelle :</p>
						<h4>{this.props.room}</h4>
					</div>
					<div id="hiddenDiv">
						<div id="button_close_div">
							<button id='button_close' onClick={this.closePop}></button>
						</div>
						<div className="input-group">
							<input type="text"
								className="form-control"
								placeholder="Changer Pseudo"
								id="changepseudo"
								value={this.state.inputPseudo}
								onChange={this.handleNewValuePseudo}
								value={this.state.inputValuePseudo}
								onKeyPress={this.handlePseudoPress}
							/>
							<span className="input-group-addon"
								id="basic-addon2"
								onClick={this.handleChangePseudo}>Change
							</span>
						</div>
						<br />
						<h5>Modifier le thème</h5>
						<div id="slide_theme" className="btn-group" data-toggle="buttons">
							<label id='test2' className="btn btn-secondary">
								<input type="radio" name="light" id="changeColor1" onChange={this.changeColor} /><span id='spanLight'> Light </span>
							</label>
							<label className="btn btn-secondary">
								<input type="radio" name="dark" id="changeColor2" onChange={this.changeColor} /><span id='spanDark'> Dark </span>
							</label>
							<label id='test' className="btn btn-secondary">
								<input type="radio" name="pink" id="changeColor3" onChange={this.changeColor} /><span id='spanPink'> Pink </span>
							</label>
							<div id="circle" className={this.state.theme}></div>
						</div>
						<br />
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
