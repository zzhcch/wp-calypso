/**
 * External dependencies
 */
import React from 'react';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import analytics from 'lib/analytics';
import { renderWithReduxStore } from 'lib/react-helpers';
import DocumentHead from 'components/data/document-head';
import LostPassword from 'account-recovery/lost-password';

const ANALYTICS_PAGE_TITLE = 'Account Recovery';

export default {
	lostPassword( context ) {
		const basePath = context.path;

		analytics.pageView.record( basePath, ANALYTICS_PAGE_TITLE + ' > Lost Password' );

		renderWithReduxStore(
			<div>
				<DocumentHead title={ i18n.translate( 'Lost Password ‹ Account Recovery' ) } />
				<LostPassword className="account-recovery__container" />
			</div>,
			document.getElementById( 'primary' ),
			context.store
		);
	},
};
