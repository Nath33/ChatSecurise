import React from 'react'
import UserRow from '../row/userRow';

export default class UserList extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div id="zone_users" className="col-2">
				<div className="input-group">
					<input type="text" className="form-control" placeholder="Username" aria-label="username"
								 aria-describedby="basic-addon2"/>
					<span className="input-group-addon" id="basic-addon2">Search</span>
				</div>
				<div id="users">
					{this.props.users.map((user, index) => <UserRow key={index} user={user}/>)}
				</div>
			</div>
		)
	}
}


