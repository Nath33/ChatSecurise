import React from 'react'

export default class RoomRow extends React.Component {

	constructor(props) {
		super(props)

	}

	handle = () => {

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
