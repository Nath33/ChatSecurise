import React from 'react'
import MessageRow from '../row/messageRow'
import { Picker } from 'emoji-mart'

export default class Chat extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			inputValue: ""
		}
	}

	send = () => {
		this.props.onSend(this.state.inputValue)
		this.setState({
			inputValue: ""
		})
	}

	update = (evt) => {
		this.setState({
			inputValue:evt.target.value
		})
	}

	handleEnterPress = (target) => {
		if(target.charCode === 13) //13 = la touche entrée
			this.send()
	}

	addEmoji = (emoji, event) => {
    	var inputSmiley = document.getElementById("inputSmiley");
    	inputSmiley.value += emoji.native;
		this.setState({
			inputValue:inputSmiley.value
		})
		inputSmiley.focus();
	}

	render() {

		return (
			<div id="zone_chat" className="col-8">
				<div className="App">
					<div id="text">
						<div id="msg">
							<ul>
								{this.props.messages.map((post, index) => <li key={index}><MessageRow message={post}/></li>)}
							</ul>
						</div>
					</div>
				</div>
				<div className="input-group">
					<input type="text"
							className="form-control"
							placeholder="Écrire ici..."
							value={this.state.inputValue}
							onChange={this.update}
							onKeyPress={this.handleEnterPress}
							id="inputSmiley"
					/>

					<span className="btn_smiley">:)</span>

					<Picker set='twitter'
						include='smileys & people'
						style={{ position: 'absolute', bottom: '15vh', right: '0px', zIndex: '10', overflowY: 'auto', height: '300px'}}
						className="hiddenSmiley"
						onClick={this.addEmoji}
						onKeyPress={this.handleEnterPress}
					/>

					<span className="input-group-addon"
							id="basic-addon2"
							onClick={this.send}>Envoyer
					</span>
				</div>
			</div>
		)
	}
}
