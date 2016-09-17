import fetchJsonp from 'fetch-jsonp';

/**
 * Internal dependencies
 */
import { USER_RECEIVE } from 'state/action-types';

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

const fetching = {};

export function fetchUser( userId ) {
	return function( dispatch ) {
		if ( fetching[ userId ] ) {
			return fetching[ userId ];
		}

		const fetch = fetchJsonp( `https://gravatar.com/${ userId }.json` );
		fetching[ userId ] = fetch.then( response => {
			delete fetching[ userId ];
			return response.json();
		} ).then( response => {
			const user = response.entry[ 0 ];
			user.ID = user.id;
			user.username = user.requestHash;
			user.name = user.displayName;
			user.avatar_URL = user.thumbnailUrl;
			dispatch(
				receiveUser( user )
			);
		}, err => {
			receiveUser( {
				ID: userId,
				username: userId,
				error: err
			} );
		} );
		return fetching[ userId ];
	};
}
