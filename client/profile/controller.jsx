/**
 * External Dependencies
 */
import React from 'react';
import ReactDom from 'react-dom';

/**
 * Internal Dependencies
 */
import Main from 'components/main';
import Gravatar from 'components/gravatar';

function Profile( { userId } ) {
	const fakeUser = {
		name: 'Len Bowery',
		username: userId,
		avatar_URL: null
	};
	return (
		<Main>
			<Gravatar user={ fakeUser } size={ 96 } />
			<h1 className="profile__name">{ fakeUser.name }</h1>
			<h2 className="profile__username">{ fakeUser.username }</h2>
			<section>
				<h2>Posts</h2>
				<ol>
					<li>post</li>
					<li>post</li>
				</ol>
			</section>
		</Main>
	);
}

export function userProfile( context ) {
	const userId = context.params.user;
	ReactDom.render(
		<Profile userId={ userId } />,
		document.getElementById( 'primary' )
	);
}
