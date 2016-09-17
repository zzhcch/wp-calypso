/**
 * External Dependencies
 */
import React from 'react';

/**
 * Internal Dependencies
 */
import ProfileMain from './main';
import { renderWithReduxStore } from 'lib/react-helpers';

export function userProfile( context ) {
	const userId = context.params.user;
	renderWithReduxStore(
		<ProfileMain userId={ userId } />,
		document.getElementById( 'primary' ),
		context.store
	);
}
