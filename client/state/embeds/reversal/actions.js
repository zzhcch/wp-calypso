/**
 * Internal dependencies
 */
import wpcom from 'lib/wp';
import {
	EMBED_REVERSAL_RECEIVE,
	EMBED_REVERSAL_REQUEST,
	EMBED_REVERSAL_REQUEST_FAILURE,
	EMBED_REVERSAL_REQUEST_SUCCESS
} from 'state/action-types';

export function receiveEmbedReversal( siteId, markup, result ) {
	return {
		type: EMBED_REVERSAL_RECEIVE,
		siteId,
		markup,
		result
	};
}

export function requestEmbedReversal( siteId, markup ) {
	return ( dispatch ) => {
		dispatch( {
			type: EMBED_REVERSAL_REQUEST,
			siteId,
			markup
		} );

		return wpcom.undocumented().site( siteId ).embedReversal( markup )
			.then( ( result ) => {
				dispatch( receiveEmbedReversal( siteId, markup, result ) );
				dispatch( {
					type: EMBED_REVERSAL_REQUEST_SUCCESS,
					siteId,
					markup
				} );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: EMBED_REVERSAL_REQUEST_FAILURE,
					siteId,
					markup,
					error
				} );
			} );
	};
}
