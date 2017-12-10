import React from 'react'

export default class UserRow extends React.Component {

    constructor(props) {
        super(props)
    }

    handle= ()=>{
    	this.props.click(this.props.user)
	}

    render() {
        return (
            <div>
                <li onClick={this.handle}>
                    <img id='profil' src='http://lorempixel.com/400/200' />
                    {this.props.user}
                </li>
            </div>
        )
    }
}
