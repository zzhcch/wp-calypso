/**
 * External Dependencies
 */
import React from 'react';
import ReactDom from 'react-dom';

/**
 * Internal Dependencies
 */
import Main from 'components/main';

function Profile( { userId } ) {
	return (
		<Main>
			<div>{ userId }</div>
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
