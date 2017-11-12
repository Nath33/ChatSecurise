import React from 'react'
import {subscribe} from './../../connectToSocket';

export default class RoomRow extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			myRoom: '',
		}
	}
	componentDidMount(){
		subscribe('yourRoom', (jsonRoom) => {
			this.setState({
				myRoom: JSON.parse(jsonRoom),
				messages: [],
			})
		})
	}

	componentWillUpdate(){
		if(this.state.myRoom === this.props.room){document.getElementById(this.props.room).style.color = 'orange'}
		else{document.getElementById(this.props.room).style.color = 'pink'}
		console.log(this.state.myRoom)
	}

	handle = () => {
		this.props.click(this.props.room)
		this.setState({
			myRoom: this.props.room
		})
		console.log(this.state.myRoom)
	}

	render() {
		return (
			<div>
				<li id={this.props.room} onClick={this.handle}>
					{this.props.room}
				</li>
			</div>
		)
	}
}
