import React from 'react'

export default class MessageRow extends React.Component {

	constructor(props) {
		super(props)
	}

	remplacement = (message, smiley, cible)=>{
		do{
			message=message.replace(smiley,cible)
		}while(message.indexOf(smiley) != -1)
		return message
	}

	addSmiley = (message)=>{
		//modifier message pour regex - :'D :D :* :p :'( ;) :) <3 :santa: :france:
		message = this.remplacement(message, ":'D", "!!!")
		message = this.remplacement(message, ":D", "!!")
		message = this.remplacement(message, ":*", "!!")
		message = this.remplacement(message, ":p", "!!")
		message = this.remplacement(message, ":'(", "!!!")
		message = this.remplacement(message, ";)", "!!")
		message = this.remplacement(message, ":)", "!!")
		message = this.remplacement(message, "<3", "!!")
		message = this.remplacement(message, ":santa:", "!!!!!!!")
		message = this.remplacement(message, ":france:", "Guadeloupe")
		return message
	}

	render() {
		return (
			<div>
				<h3>{this.props.message.pseudo}</h3>
				<p> -- {this.props.message.date.toDateString()}</p>
				<p>{this.addSmiley(this.props.message.message)}</p>
			</div>
		)
	}
}
