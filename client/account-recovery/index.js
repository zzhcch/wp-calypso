/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import controller from './controller';

export default function() {
	// Main route for account recovery is the lost password page
	page( '/account-recovery', controller.lostPassword );
}
