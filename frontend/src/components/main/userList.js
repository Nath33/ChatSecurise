import React from 'react'
import UserRow from '../row/userRow';

export default class UserList extends React.Component {

	constructor(props) {
		super(props)
	}

	countElement = () => {
		let count = 0
		this.props.users.map((user, index) => {
			if (user !== "Admin") { count++; console.log(count) }
		})
		if (count < 2)
			return count+" utilisateur connecté"
		else
			return count+" utilisateurs connectés"
	}

	render() {

        const listItems = this.props.users.map(function (user, index) {
            if (user !== "Admin")
				return <UserRow key={index} user={user}/>
		});

		return (
			<div id="zone_users" className="col-2">
				<div className="input-group">
					<input type="text" className="form-control" placeholder="Nom d'utilisateur" aria-label="username"
							aria-describedby="basic-addon2"/>
					<span className="input-group-addon" onClick={this.createRoom}>Rechercher</span>
				</div>
				<p className="nbItem">{this.countElement()}</p>
				<div id="users">
					{listItems}
				</div>
			</div>
		)
	}
}
