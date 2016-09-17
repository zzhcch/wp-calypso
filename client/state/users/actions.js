import fetchJsonp from 'fetch-jsonp';

/**
 * Internal dependencies
 */
import { USER_RECEIVE } from 'state/action-types';

function mockApiFetch( userId ) {
	return new Promise( ( resolve, reject ) => {
		resolve( {
			ID: userId,
			name: 'your name',
			avatar_URL: ''
		} );
	} );
}

/**
 * Returns an action object to be used in signalling that a user object has
 * been received.
 *
 * @param  {Object} user User received
 * @return {Object}      Action object
 */
export function receiveUser( user ) {
	return {
		type: USER_RECEIVE,
		user
	};
}

export function fetchUser( userId ) {
	return function( dispatch ) {
		const fetch = fetchJsonp( `https://gravatar.com/${ userId }.json` );
		return fetch.then( response => {
			return response.json();
		} ).then( response => {
			const user = response.entry[ 0 ];
			user.ID = 'gravatar-' + user.id;
			user.username = user.requestHash;
			user.name = user.displayName;
			user.avatar_URL = user.thumbnailUrl;
			dispatch(
				receiveUser( user )
			);
		}, err => {
			console.error( err );
			receiveUser( {
				ID: userId,
				username: userId,
				error: err
			} );
		} );
	};
}
