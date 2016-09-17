/**
 * Internal dependencies
 */
import wpcom from 'lib/wp';
import {
	SHARING_BUTTONS_LIST_FETCH,
	SHARING_BUTTONS_LIST_FETCH_FAILURE,
	SHARING_BUTTONS_LIST_FETCH_SUCCESS
} from 'state/action-types';

/**
 * Triggers a network request to fetch sharing buttons for the specified
 * site ID.
 *
 * @param  {Number}   siteId Site ID
 * @return {Function}        Action thunk
 */
export function fetchButtons( siteId ) {
	return ( dispatch ) => {
		dispatch( {
			type: SHARING_BUTTONS_LIST_FETCH,
			siteId
		} );

		return new Promise( ( resolve ) => {
			wpcom.undocumented().sharingButtons( siteId, ( error, data ) => {
				if ( error ) {
					dispatch( failButtonsRequest( siteId, error ) );
				} else {
					dispatch( receiveButtons( siteId, data ) );
				}

				resolve();
			} );
		} );
	};
}

/**
 * Returns an action object to be used in signalling that a network request for
 * sharing buttons has been received.
 *
 * @param  {Number} siteId Site ID
 * @param  {Object} data   API response
 * @return {Object}        Action object
 */
export function receiveButtons( siteId, data ) {
	return {
		type: SHARING_BUTTONS_LIST_FETCH_SUCCESS,
		siteId,
		data
	};
}

/**
 * Returns an action object to be used in signalling that a network request for
 * sharing buttons has failed.
 *
 * @param  {Number} siteId Site ID
 * @param  {Object} error  API response error
 * @return {Object}        Action object
 */
export function failButtonsRequest( siteId, error ) {
	return {
		type: SHARING_BUTTONS_LIST_FETCH_FAILURE,
		siteId,
		error
	};
}
