/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { merge } from 'lodash';

/**
 * Internal dependencies
 */
import { createReducer } from 'state/utils';
import {
	EMBED_REVERSAL_RECEIVE,
	EMBED_REVERSAL_REQUEST,
	EMBED_REVERSAL_REQUEST_FAILURE,
	EMBED_REVERSAL_REQUEST_SUCCESS
} from 'state/action-types';

export const requesting = createReducer( {}, {
	[ EMBED_REVERSAL_REQUEST ]: ( state, { siteId } ) => {
		return { ...state, [ siteId ]: true };
	},
	[ EMBED_REVERSAL_REQUEST_FAILURE ]: ( state, { siteId } ) => {
		return { ...state, [ siteId ]: false };
	},
	[ EMBED_REVERSAL_REQUEST_SUCCESS ]: ( state, { siteId } ) => {
		return { ...state, [ siteId ]: false };
	}
} );

export const items = createReducer( {}, {
	[ EMBED_REVERSAL_RECEIVE ]: ( state, { siteId, markup, result } ) => {
		return merge( {}, state, {
			[ siteId ]: {
				[ markup ]: result
			}
		} );
	},
	[ EMBED_REVERSAL_REQUEST_FAILURE ]: ( state, { siteId, markup, error } ) => {
		if ( error.error !== 'invalid_embed' ) {
			return state;
		}

		return merge( {}, state, {
			[ siteId ]: {
				[ markup ]: error
			}
		} );
	}
} );

export default combineReducers( {
	requesting,
	items
} );
