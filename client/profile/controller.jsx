/**
 * External Dependencies
 */
import React from 'react';
import ReactDom from 'react-dom';

/**
 * Internal Dependencies
 */
import ProfileMain from './main';

export function userProfile( context ) {
	const userId = context.params.user;
	ReactDom.render(
		<ProfileMain userId={ userId } />,
		document.getElementById( 'primary' )
	);
}
