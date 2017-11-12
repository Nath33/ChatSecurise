import React from 'react'
import {subscribe} from './../../connectToSocket';

export default class RoomRow extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			myRoom: 'default',
		}
	}

	componentDidMount(){
		subscribe('yourRoom', (jsonRoom) => {
			this.setState({
				myRoom: JSON.parse(jsonRoom),
			})
		})
		if(this.state.myRoom === this.props.room){document.getElementById(this.props.room).style.color = 'orange'}
		else{document.getElementById(this.props.room).style.color = 'pink'}
	}

	shouldComponentUpdate(){
		if(this.state.myRoom === this.props.room){document.getElementById(this.props.room).style.color = 'orange'}
		else{document.getElementById(this.props.room).style.color = 'pink'}
	}

	handle = () => {
		this.props.click(this.props.room)
		this.setState({
			myRoom: this.props.room
		})
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
