/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import omitBy from 'lodash/omitBy';
import keyBy from 'lodash/keyBy';

/**
 * Internal dependencies
 */
import {
	SHARING_BUTTONS_LIST_FETCH,
	SHARING_BUTTONS_LIST_FETCH_FAILURE,
	SHARING_BUTTONS_LIST_FETCH_SUCCESS,
	SERIALIZE,
	DESERIALIZE
} from 'state/action-types';
import { sharingButtonsSchema } from './schema';
import { isValidStateWithSchema } from 'state/utils';

/**
 * Track the current status for fetching connections. Maps site ID to the
 * fetching status for that site. Assigns `true` for currently fetching,
 * `false` for done or failed fetching, or `undefined` if no fetch attempt
 * has been made for the site.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function fetchingSharingButtons( state = {}, action ) {
	switch ( action.type ) {
		case SHARING_BUTTONS_LIST_FETCH:
		case SHARING_BUTTONS_LIST_FETCH_FAILURE:
		case SHARING_BUTTONS_LIST_FETCH_SUCCESS:
			const { type, siteId } = action;

			state = { ...state, [ siteId ]: SHARING_BUTTONS_LIST_FETCH === type };
			break;

		case SERIALIZE:
		case DESERIALIZE:
			state = {};
			break;
	}

	return state;
}

/**
 * Tracks all known sharing buttons objects, indexed by buttons ID.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function sharingButtons( state = {}, action ) {
	switch ( action.type ) {
		case SHARING_BUTTONS_LIST_FETCH:
			state = {
				...omitBy( state, { siteId: action.siteId } ),
				...keyBy( action.data.sharing_buttons, 'ID' )
			};
			break;

		case DESERIALIZE:
			if ( ! isValidStateWithSchema( state, sharingButtonsSchema ) ) {
				state = {};
			}
			break;
	}

	return state;
}

export default combineReducers( {
	fetchingSharingButtons,
	sharingButtons
} );
