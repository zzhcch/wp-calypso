/**
 * External Dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal Dependencies
 */
import Gravatar from 'components/gravatar';
import { getUserByLogin } from 'state/users/selectors';

export function UserProfile( { user } ) {
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
		: <span>No user found</span>
	);
}

export default connect(
	( state, ownProps ) => {
		return {
			user: getUserByLogin( state, ownProps.userId )
		};
	}
)( UserProfile );
