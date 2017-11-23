import React from 'react'
import UserRow from '../row/userRow';

export default class UserList extends React.Component {

	constructor(props) {
		super(props)
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
					<span className="input-group-addon" id="basic-addon2">Rechercher</span>
				</div>
				<div id="users">
					{listItems}
				</div>
			</div>
		)
	}
}
