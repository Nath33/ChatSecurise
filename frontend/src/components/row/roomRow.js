import React from 'react'
import {subscribe} from './../../connectToSocket';

export default class RoomRow extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			myRoom: ''
		}
	}

	handle = () => {
		this.props.click(this.props.room)
		subscribe('yourRoom', (jsonRoom) => {
			this.setState({
				myRoom: JSON.parse(jsonRoom),
			})
		})
	}

	render() {
		let list = "";
		if (this.props.room === this.props.test)
			list = <span className="roomSelected">{this.props.room}</span>;
		else
			list = <span>{this.props.room}</span>;

		return (
			<div>
				<li id={this.props.room} onClick={this.handle}>
					{list}
				</li>
			</div>
		)
	}
}
