import React from 'react'

export default class MessageRow extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<h3><img
					src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
					alt="Red dot"/>{this.props.message.pseudo} {this.props.message.date.toDateString()}</h3>
				<p>{this.props.message.message}</p>
			</div>
		)
	}
}
