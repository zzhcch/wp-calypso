/**
 * External dependencies
 */
import tinymce from 'tinymce/tinymce';
import { forEach, includes } from 'lodash';

/**
 * Internal dependencies
 */
import PostEditStore from 'lib/posts/post-edit-store';
import {
	queueEditorEmbedReversal,
	removePendingEditorEmbedReversal
} from 'state/ui/editor/actions';
import { getPendingEmbedReversals } from 'state/ui/editor/selectors';
import { requestEmbedReversal } from 'state/embeds/reversal/actions';
import { getEmbedReversalResult } from 'state/embeds/reversal/selectors';
import { getSelectedSiteId } from 'state/ui/selectors';

function embedReversal( editor ) {
	const store = editor.getParam( 'redux_store' );
	if ( ! store ) {
		return;
	}

	const { dispatch, getState } = store;

	function onPaste( event ) {
		// Check whether pasted content looks like markup
		const markup = event.clipboardData.getData( 'text/plain' );
		if ( ! /^<.*>$/.test( markup ) ) {
			return;
		}

		// If so, queue a request for reversal
		dispatch( requestEmbedReversal( getSelectedSiteId( getState() ), markup ) );
		dispatch( queueEditorEmbedReversal( markup ) );
	}

	// Bind paste event listeners to both Visual and HTML editors
	editor.on( 'paste', onPaste );
	const textarea = editor.getParam( 'textarea' );
	if ( textarea ) {
		textarea.addEventListener( 'paste', onPaste );
	}

	store.subscribe( () => {
		// Check all pending embed reversals to see if result has been received
		const state = getState();
		forEach( getPendingEmbedReversals( state ), ( markup ) => {
			const result = getEmbedReversalResult( state, getSelectedSiteId( state ), markup );
			if ( ! result ) {
				return;
			}

			// Even if result was an error, remove it from pending set
			dispatch( removePendingEditorEmbedReversal( markup ) );
			if ( result instanceof Error ) {
				return;
			}

			const isVisualEditMode = ! editor.isHidden();

			if ( isVisualEditMode ) {
				// Check textContent of all elements in Visual editor body
				forEach( editor.getBody().querySelectorAll( '*' ), ( element ) => {
					if ( includes( element.textContent, markup ) ) {
						element.textContent = element.textContent.replace( markup, result.result );
						editor.undoManager.add();
						return false;
					}
				} );
			} else {
				// Else set the textarea content from store raw content
				let content = PostEditStore.getRawContent();
				if ( ! includes( content, markup ) ) {
					return;
				}

				content = content.replace( markup, result.result );
				editor.fire( 'SetTextAreaContent', { content } );
			}

			// Trigger an editor change so that dirty detection and autosave
			// take effect
			editor.fire( 'change' );
		} );
	} );
}

export default () => {
	tinymce.PluginManager.add( 'wpcom/embedreversal', embedReversal );
};
