import wpcom from 'lib/wp';

/**
 * Internal dependencies
 */
import {
	SITE_EMBEDS_FETCH,
	SITE_EMBEDS_FETCH_COMPLETE,
	SITE_EMBEDS_FETCH_FAILED
} from 'state/action-types';

export function fetchSiteEmbeds( siteId ) {
	return dispatch => {
		dispatch( {
			type: SITE_EMBEDS_FETCH,
			siteId
		} );

		const fetchComplete = data => dispatch( embedsFetchComplete( data.embeds ) );
		const fetchFailed = error => dispatch( embedsFetchFailed( siteId, error ) );

		return wpcom.undocumented()
			.site( siteId )
			.embeds( {} )
			.then( fetchComplete )
			.catch( fetchFailed );		
	};
}

export function embedsFetchComplete( embeds ) {
	return {
		type: SITE_EMBEDS_FETCH_COMPLETE,
		embeds
	};
}

export function embedsFetchFailed( siteId, error ) {
	return {
		type: SITE_EMBEDS_FETCH_FAILED,
		siteId,
		error
	};
}
