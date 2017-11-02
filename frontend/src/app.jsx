import React from 'react';
import 'styles/index.scss';
import Row from 'core/row';
import {sendToServer, subscribe} from './connectToSocket';


export default class App extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: "",
			data: []
		}
	}

	componentDidMount() {
		App.checkUser()
		subscribe('Error', (message) => {
			console.log(message)
		})

		subscribe('Error', (message) => {
			alert(message)
			App.checkUser()
		})

		subscribe('message', (data) => {
			let value = JSON.parse(data)
			let newVal = this.state.data
			newVal.push({pseudo: value.pseudo, message: value.message, date: new Date()})
			this.setState({
				data: newVal
			})
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
		sendToServer("message", this.state.value)
		this.setState({
			value: ""
		})
	}


	render() {
		return (
			<div>
				<div className="App">
					<div id="text">
						<div id="msg">
							<ul>
								{this.state.data.map(post => <li key={post.date}><Row data={post}/></li>)}
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
		);
	}
}
