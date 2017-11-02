import React from 'react'

export default class UserRow extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <li>
                <img id='profil' src='http://lorempixel.com/400/200' />
                {this.props.user}
                </li>
            </div>
        )
    }
}
