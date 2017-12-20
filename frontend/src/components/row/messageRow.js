import React from 'react'
var dateFormat = require('dateformat');

export default class MessageRow extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<h3>{this.props.message.pseudo}</h3>
				<p> -- {dateFormat(this.props.message.date, "dddd d, h:MM")}</p>
				<p>{this.props.message.message}</p>
			</div>
		)
	}
}
