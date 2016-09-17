/**
 * External Dependencies
 */
import React from 'react';
/**
 * Internal Dependencies
 */
import Main from 'components/main';
import UserProfile from 'blocks/user-profile';

export default function Profile( { userId } ) {
	return (
		<Main>
			<UserProfile userId={ userId } />
		</Main>
	);
}
