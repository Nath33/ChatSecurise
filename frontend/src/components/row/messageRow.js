import React from 'react'

export default class MessageRow extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<h3>{this.props.message.pseudo}</h3>
				<p> -- {this.props.message.date.toDateString()}</p>
				<p>{this.props.message.message}</p>
			</div>
		)
	}
}
