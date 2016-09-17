/**
 * External Dependencies
 */
import React from 'react';

/**
 * Internal Dependencies
 */
import Gravatar from 'components/gravatar';

function getUserFromId( userId ) {
	return {
		ID: userId,
		name: 'Len Bowery',
		username: userId,
		avatar_URL: null
	};
}

export default function( { userId } ) {
	const fakeUser = getUserFromId( userId );
	return (
		<div className="user-profile">
			<Gravatar user={ fakeUser } size={ 96 } />
			<h1 className="user-profile__name">{ fakeUser.name }</h1>
			<h2 className="user-profile__username">{ fakeUser.username }</h2>
			<section>
				<h2>Posts</h2>
				<ol>
					<li>post</li>
					<li>post</li>
				</ol>
			</section>
		</div>
	);
}
