import React from 'react'

export default class RoomRow extends React.Component {

	constructor(props) {
		super(props)

	}

	handle = () => {
		this.props.click(this.props.room)
	}

	render() {
		return (
			<div>
				<li onClick={this.handle}>
					{this.props.room}
				</li>
			</div>
		)
	}
}
