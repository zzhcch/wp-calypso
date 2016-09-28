/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { without } from 'lodash';

/**
 * Internal dependencies
 */
import { createReducer } from 'state/utils';
import {
	EDITOR_EMBED_REVERSAL_QUEUE,
	EDITOR_EMBED_REVERSAL_PENDING_REMOVE,
	EDITOR_POST_ID_SET,
	EDITOR_SHOW_DRAFTS_TOGGLE
} from 'state/action-types';
import imageEditor from './image-editor/reducer';
import lastDraft from './last-draft/reducer';
import contactForm from './contact-form/reducer';

/**
 * Returns the updated editor post ID state after an action has been
 * dispatched.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function postId( state = null, action ) {
	switch ( action.type ) {
		case EDITOR_POST_ID_SET:
			return action.postId;
	}

	return state;
}

/**
 * Returns the updated editor draft drawer visibility state after an action
 * has been dispatched.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated state
 */
export function showDrafts( state = false, action ) {
	switch ( action.type ) {
		case EDITOR_SHOW_DRAFTS_TOGGLE:
			return ! state;
	}

	return state;
}

export const pendingEmbedReversals = createReducer( [], {
	[ EDITOR_EMBED_REVERSAL_QUEUE ]: ( state, { markup } ) => [ ...state, markup ],
	[ EDITOR_EMBED_REVERSAL_PENDING_REMOVE ]: ( state, { markup } ) => without( state, markup ),
	[ EDITOR_POST_ID_SET ]: () => []
} );

export default combineReducers( {
	postId,
	showDrafts,
	imageEditor,
	pendingEmbedReversals,
	lastDraft,
	contactForm
} );
