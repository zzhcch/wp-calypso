/**
 * External Dependencies
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * Internal Dependencies
 */
import Gravatar from 'components/gravatar';
import { getUserByLogin } from 'state/users/selectors';
import { fetchUser } from 'state/users/actions';
import Button from 'components/button';

export function UserProfile( { user, userId, fetchUser } ) {
	function fetch() {
		fetchUser( userId );
	}

	return (
		user ?
		<div className="user-profile">
			<Gravatar user={ user } size={ 96 } />
			<h1 className="user-profile__name">{ user.name }</h1>
			<h2 className="user-profile__username">{ user.username }</h2>
			<section>
				<h2>Posts</h2>
				<ol>
					<li>post</li>
					<li>post</li>
				</ol>
			</section>
		</div>
		: <span>
			No user data ...
			<Button onClick={ fetch }>Fetch</Button></span>
	);
}

export default connect(
	( state, ownProps ) => {
		return {
			user: getUserByLogin( state, ownProps.userId )
		};
	},
	dispatch => {
		return bindActionCreators( {
			fetchUser
		}, dispatch );
	}
)( UserProfile );
