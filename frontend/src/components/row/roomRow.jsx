import React from 'react'
import {subscribe} from './../../connectToSocket';

export default class RoomRow extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			myRoom: ''
		}
	}

	componentDidMount(){
		subscribe('yourRoom', (jsonRoom) => {
			this.setState({
				myRoom: JSON.parse(jsonRoom),
			})
		})
		console.log("10" + this.state.room)
	}

	handle = () => {
		this.props.click(this.props.room)
		subscribe('yourRoom', (jsonRoom) => {
			this.setState({
				myRoom: JSON.parse(jsonRoom),
			})
		})
		console.log("20" + this.state.room)
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
