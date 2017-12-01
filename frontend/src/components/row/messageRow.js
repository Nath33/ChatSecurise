import React from 'react'

export default class MessageRow extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<h3>{this.props.message.pseudo} -- </h3>
				<h5>{this.props.message.date.toDateString()}</h5>
				<p>{this.props.message.message}</p>
			</div>
		)
	}
}
