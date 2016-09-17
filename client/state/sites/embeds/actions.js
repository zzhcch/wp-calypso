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
	};
}
