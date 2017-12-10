import React from 'react'
import MessageRow from '../row/messageRow';

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
