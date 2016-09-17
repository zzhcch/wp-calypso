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

export function UserProfile( { user, userId, fetchUser } ) {
	if ( ! user ) {
		fetchUser( userId );
	}

	return (
		user ?
		<div className="user-profile">
			<Gravatar user={ user } size={ 96 } />
			<dl>
				<dt>Name</dt>
				<dd>{ user.name }</dd>
				<dt>Username</dt>
				<dd>{ user.username }</dd>
				<dt>About</dt>
				<dd>{ user.aboutMe }</dd>
			</dl>
		</div>
		: <span>Loading...</span>
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
